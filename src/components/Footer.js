import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-brand-100/70 bg-white/70 backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-brand-gradient" />
      <div className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-10">
        <div>
          <Link to="/" className="font-display italic text-2xl font-semibold text-gradient tracking-wide">
            The Store
          </Link>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-xs">
            Thoughtfully curated products, delivered with care.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 mb-4">Shop</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-brand-700 transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-brand-700 transition">About</Link></li>
            <li><Link to="/cart" className="hover:text-brand-700 transition">Cart</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 mb-4">Support</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/track" className="hover:text-brand-700 transition">Track Order</Link></li>
            <li><a href="mailto:hello@thestore.com" className="hover:text-brand-700 transition">hello@thestore.com</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-100/70">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-4 py-5 text-xs text-gray-400 text-center"
        >
          © {year} The Store. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;