import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { imageUrl } from "../utils/imageUrl";

const ProductCard = ({ product }) => {
  const outOfStock = product.stock <= 0;
  const low = !outOfStock && product.stock <= 3;

  return (
    <motion.div
      whileHover={{ y: -4, x: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="group card overflow-hidden hover:shadow-glow-lg transition-shadow"
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative aspect-[4/5] bg-clay overflow-hidden border-b-2 border-ink">
          <img
            src={imageUrl(product.images?.[0])}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              outOfStock ? "grayscale opacity-70" : ""
            }`}
          />
          {outOfStock && (
            <div className="absolute top-3 left-3 bg-ink text-paper font-display text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 -rotate-3">
              Imeisha · Sold out
            </div>
          )}
          {low && (
            <div className="absolute top-3 left-3 bg-accent-500 text-paper font-display text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 -rotate-3 border-2 border-ink">
              {product.stock} left!
            </div>
          )}
          <div className="absolute bottom-0 right-0 bg-sun-400 border-t-2 border-l-2 border-ink px-3 py-1.5 font-display font-extrabold text-sm">
            KES {product.price.toLocaleString()}
          </div>
        </div>
        <div className="p-3.5">
          <p className="eyebrow !text-[10px]">{product.category}</p>
          <h3 className="font-display font-bold text-base text-ink mt-0.5 leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
