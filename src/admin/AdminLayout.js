import React, { useEffect, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { adminLogout } from "./AdminAuth";

const NAV = [
  { to: "/admin", label: "Analytics", icon: "📊", end: true },
  { to: "/admin/orders", label: "Orders", icon: "📦" },
  { to: "/admin/products", label: "Products", icon: "🛍️" },
  { to: "/admin/locations", label: "Pickup Locations", icon: "📍" },
  { to: "/admin/staff", label: "Staff & PINs", icon: "🔐" },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-bold border-2 transition ${
    isActive
      ? "bg-sun-400 text-ink border-ink shadow-pop-sm"
      : "border-transparent text-paper/80 hover:bg-paper/10 hover:text-paper"
  }`;

const AdminLayout = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("adminSidebarCollapsed") === "1";
    } catch {
      return false;
    }
  }); // desktop sidebar

  // Close the drawer whenever the route changes
  useEffect(() => setOpen(false), [location.pathname]);

  // Esc closes the drawer
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock page scroll behind the open drawer (mobile only)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleMenu = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setCollapsed((c) => {
        try {
          localStorage.setItem("adminSidebarCollapsed", c ? "0" : "1");
        } catch {}
        return !c;
      });
    } else {
      setOpen((o) => !o);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Backdrop (mobile) */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-ink/60 lg:hidden transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Sidebar: slide-in drawer on mobile, collapsible panel on desktop */}
      <aside
        aria-label="Admin menu"
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-brand-900 text-paper flex flex-col
          border-r-2 border-ink transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          ${collapsed ? "lg:-translate-x-full" : "lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between px-4 h-16 shrink-0">
          <Link to="/admin" className="font-display font-extrabold text-xl leading-none">
            Mumi <span className="text-sun-400">Admin</span>
          </Link>
          <button
            onClick={() => (window.innerWidth >= 1024 ? toggleMenu() : setOpen(false))}
            aria-label="Close menu"
            className="h-9 w-9 rounded-lg border-2 border-paper/30 hover:bg-paper/10 text-lg leading-none"
          >
            ✕
          </button>
        </div>
        <div className="shuka-band shuka-band-sm" />

        <nav className="space-y-1.5 flex-1 overflow-y-auto p-3">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>
              <span className="text-base">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 mt-4 rounded-xl text-sm font-display font-bold text-paper/70 hover:text-paper hover:bg-paper/10"
          >
            <span className="text-base">↗</span> View store
          </Link>
        </nav>

        <div className="p-4 border-t border-paper/15 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p className="text-xs text-paper/60 mb-2 truncate">
            Signed in as {localStorage.getItem("adminName") || "admin"}
          </p>
          <button onClick={() => adminLogout()} className="text-sm font-display font-bold text-sun-300 hover:underline">
            Log out
          </button>
        </div>
      </aside>

      {/* Content column */}
      <div className={`transition-[padding] duration-300 ${collapsed ? "lg:pl-0" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur border-b-2 border-ink h-14 flex items-center gap-3 px-3 sm:px-5">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="h-10 w-10 rounded-lg border-2 border-ink bg-white shadow-pop-sm flex flex-col items-center justify-center gap-1 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
          </button>
          <span className="font-display font-extrabold text-lg">
            {NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))?.label || "Admin"}
          </span>
        </header>

        <main className="p-4 sm:p-6 max-w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
