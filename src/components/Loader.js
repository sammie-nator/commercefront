import React from "react";
import { motion } from "framer-motion";

// Three bouncing "coffee cherries" — a nod to Embu's coffee country
const Loader = ({ label = "Inapakia..." }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={`h-4 w-4 rounded-full border-2 border-ink ${
            ["bg-accent-500", "bg-sun-400", "bg-brand-600"][i]
          }`}
          animate={{ y: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
    <p className="text-sm text-ink/60 font-display font-semibold">{label}</p>
  </div>
);

export default Loader;
