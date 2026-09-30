import React from "react";
import { Link } from "react-router-dom";
import { SITE, waLink } from "../config/site";

const Footer = () => {
  const year = new Date().getFullYear();
  const wa = waLink();

  return (
    <footer className="mt-20 bg-brand-900 text-paper">
      <div className="shuka-band" />
      <div className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-10">
        <div>
          <p className="font-display font-extrabold text-3xl">
            Mumi <span className="text-sun-400">Thrifts</span>
          </p>
          <p className="font-hand text-2xl text-sun-300 mt-1">Karibu tena!</p>
          <p className="text-sm text-paper/70 mt-3 max-w-xs leading-relaxed">
            {SITE.tagline}. Quality finds at fair prices, paid with M-Pesa, picked up close to you.
          </p>
        </div>

        <div>
          <p className="eyebrow !text-sun-400 mb-4">Duka</p>
          <ul className="space-y-2 text-sm text-paper/80">
            <li><Link to="/" className="hover:text-sun-300">Shop</Link></li>
            <li><Link to="/about" className="hover:text-sun-300">Our Story</Link></li>
            <li><Link to="/cart" className="hover:text-sun-300">Kikapu (Cart)</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow !text-sun-400 mb-4">Msaada / Help</p>
          <ul className="space-y-2 text-sm text-paper/80">
            <li><Link to="/track" className="hover:text-sun-300">Track Order</Link></li>
            <li><a href={`mailto:${SITE.email}`} className="hover:text-sun-300">{SITE.email}</a></li>
            {wa && (
              <li><a href={wa} target="_blank" rel="noreferrer" className="hover:text-sun-300">WhatsApp us</a></li>
            )}
            <li className="text-paper/60">Based in {SITE.town}, Kenya</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/15">
        <p className="max-w-6xl mx-auto px-4 py-5 text-xs text-paper/60 text-center pb-24 sm:pb-5">
          © {year} {SITE.name} · Made with ♥ in {SITE.town} 🇰🇪
        </p>
      </div>
    </footer>
  );
};

export default Footer;
