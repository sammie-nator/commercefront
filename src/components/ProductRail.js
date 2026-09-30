import React, { useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const ProductRail = ({ products = [], title, subtitle }) => {
  const trackRef = useRef(null);
  const scrollBy = (amount) => trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });

  if (!products.length) return null;

  return (
    <section className="mb-14">
      {(title || subtitle) && (
        <div className="flex items-end justify-between mb-5">
          <div>
            {subtitle && <p className="eyebrow mb-1">{subtitle}</p>}
            {title && <h2 className="font-display font-extrabold text-3xl">{title}</h2>}
          </div>
          <div className="hidden sm:flex gap-2">
            {[["‹", -320, "Scroll left"], ["›", 320, "Scroll right"]].map(([c, amt, l]) => (
              <button key={l} onClick={() => scrollBy(amt)} aria-label={l} className="btn-ghost !p-0 h-10 w-10 text-xl">
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Native scroll-snap: swipes naturally on phones */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pr-2 snap-x snap-mandatory -mx-4 px-4"
      >
        {products.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="min-w-[170px] w-[170px] sm:min-w-[210px] sm:w-[210px] snap-start shrink-0"
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductRail;
