import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Split hero: bold copy on the left, photo in an arch on the right
 * (arch = the classic Kenyan doorway/kanga motif).
 * slides: [{ image, eyebrow, title, subtitle, ctaLabel, ctaTo }]
 */
const Carousel = ({ slides = [], autoPlay = true, interval = 6000 }) => {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  useEffect(() => {
    if (!autoPlay || count <= 1) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [autoPlay, interval, next, count, index]);

  if (!count) return null;
  const slide = slides[index];

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-ink bg-sun-300 shadow-pop">
      {/* sunburst behind the arch */}
      <div
        className="absolute -right-24 top-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full opacity-60"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, #f7c33b 0 10deg, #fbd66a 10deg 20deg)",
        }}
      />
      <div className="relative grid md:grid-cols-2 gap-6 items-center p-6 sm:p-10 md:p-12">
        <div className="order-2 md:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {slide.eyebrow && (
                <p className="inline-block bg-ink text-sun-300 font-display font-bold uppercase tracking-[0.16em] text-[11px] px-3 py-1 mb-4 -rotate-1">
                  {slide.eyebrow}
                </p>
              )}
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-ink mb-4">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-ink/80 text-base sm:text-lg max-w-md mb-6 leading-relaxed">{slide.subtitle}</p>
              )}
              {slide.ctaLabel && (
                <a href={slide.ctaTo || "#"} className="btn-primary text-base">
                  {slide.ctaLabel} →
                </a>
              )}
            </motion.div>
          </AnimatePresence>

          {count > 1 && (
            <div className="flex gap-2 mt-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-3 border-2 border-ink rounded-full transition-all ${
                    i === index ? "w-10 bg-ink" : "w-3 bg-paper"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-[260px] sm:w-[320px] md:w-[360px] aspect-[3/4]">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-full bg-accent-500 border-2 border-ink" />
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={slide.image}
                alt=""
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -60) next();
                  else if (info.offset.x > 60) setIndex((i) => (i - 1 + count) % count);
                }}
                className="relative h-full w-full object-cover rounded-t-full border-2 border-ink cursor-grab active:cursor-grabbing"
              />
            </AnimatePresence>
            <div className="absolute -left-3 bottom-8 bg-paper border-2 border-ink px-3 py-1 font-hand text-xl -rotate-6 shadow-pop-sm">
              Mambo vipi!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
