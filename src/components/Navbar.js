import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { SITE, SAYINGS } from "../config/site";

const links = [
  { to: "/", label: "Duka", end: true },
  { to: "/about", label: "Our Story" },
  { to: "/track", label: "Track Order" },
];

const Icon = ({ d, className = "h-6 w-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const ICONS = {
  home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  story: "M12 21s-7-4.5-7-11a7 7 0 0114 0c0 6.5-7 11-7 11zM12 7v6M9 10h6",
  track: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  basket: "M4 10h16l-1.5 9a2 2 0 01-2 1.7H7.5a2 2 0 01-2-1.7L4 10zM8 10l3-6M16 10l-3-6",
};

const Badge = ({ n, className = "" }) =>
  n > 0 ? (
    <motion.span
      key={n}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`absolute bg-sun-400 text-ink font-display font-bold border-2 border-ink rounded-full flex items-center justify-center ${className}`}
    >
      {n}
    </motion.span>
  ) : null;

const Navbar = () => {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ticker = [...SAYINGS, "Lipa na M-Pesa", `Pickup in ${SITE.town}`, "Karibu sana"];

  return (
    <>
      {/* Swahili proverb ticker */}
      <div className="bg-ink text-sun-300 overflow-hidden whitespace-nowrap text-xs font-display font-semibold tracking-wide">
        <div className="inline-flex animate-marquee py-1.5">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {ticker.map((t, i) => (
                <span key={i} className="px-5 flex items-center gap-5">
                  {t} <span className="text-accent-400">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className={`sticky top-0 z-40 bg-paper/95 backdrop-blur transition-shadow ${scrolled ? "shadow-[0_3px_0_0_#1b1512]" : ""}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2 leading-none">
            <span className="font-display font-extrabold text-2xl text-brand-700">Mumi</span>
            <span className="font-display font-extrabold text-2xl text-accent-500 -ml-1">Thrifts</span>
            <span className="hidden sm:inline font-hand text-lg text-ink/70 ml-1">· {SITE.town}</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-7 font-display font-semibold text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `relative py-1 transition ${isActive ? "text-brand-700" : "text-ink/70 hover:text-ink"}`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span layoutId="nav-underline" className="absolute left-0 right-0 -bottom-1 h-[3px] bg-accent-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <Link to="/cart" className="btn-sun !py-2 !px-4 relative">
              Kikapu
              <Badge n={totalItems} className="-top-2.5 -right-2.5 h-6 w-6 text-xs" />
            </Link>
          </nav>

          {/* Mobile: just the basket up top, everything else lives in the bottom bar */}
          <Link to="/cart" className="sm:hidden btn-sun !py-1.5 !px-3 text-sm relative">
            Kikapu
            <Badge n={totalItems} className="-top-2 -right-2 h-5 w-5 text-[10px]" />
          </Link>
        </div>
        <div className="shuka-band" />
      </header>

      {/* Mobile bottom tab bar — thumb-reach navigation */}
      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-paper border-t-2 border-ink pb-safe"
        aria-label="Main"
      >
        <div className="grid grid-cols-4">
          {[
            { to: "/", label: "Duka", icon: ICONS.home, end: true },
            { to: "/about", label: "Story", icon: ICONS.story },
            { to: "/track", label: "Track", icon: ICONS.track },
            { to: "/cart", label: "Kikapu", icon: ICONS.basket, badge: totalItems },
          ].map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-display font-bold transition ${
                  isActive ? "text-paper bg-brand-700" : "text-ink/70"
                }`
              }
            >
              <span className="relative">
                <Icon d={t.icon} className="h-5 w-5" />
                <Badge n={t.badge} className="-top-2 -right-3 h-4 w-4 text-[9px]" />
              </span>
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
