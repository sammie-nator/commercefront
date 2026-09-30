import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import ProductRail from "../components/ProductRail";
import Carousel from "../components/Carousel";
import Loader from "../components/Loader";
import { SITE, waLink } from "../config/site";
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";

const HERO_SLIDES = [
  {
    eyebrow: `Karibu · ${SITE.town}`,
    title: "Thrift finds with real character.",
    subtitle: "Hand-picked clothes, shoes and accessories at prices that respect your pocket.",
    ctaLabel: "Nunua sasa",
    ctaTo: "#shop",
    image: hero1,
  },
  {
    eyebrow: "Lipa na M-Pesa",
    title: "Pay on your phone. Pick up near you.",
    subtitle: "No stress checkout: enter your number, approve the prompt, collect your order.",
    ctaLabel: "See what's new",
    ctaTo: "#shop",
    image: hero2,
  },
  {
    eyebrow: "Mpya wiki hii",
    title: "Fresh drops, every week.",
    subtitle: "Good pieces go fast. Check back often before your size is gone.",
    ctaLabel: "Start shopping",
    ctaTo: "#shop",
    image: hero3,
  },
];

const PERKS = [
  { icon: "📱", title: "Lipa na M-Pesa", text: "Secure STK push, no cards needed" },
  { icon: "📍", title: `Pickup in ${SITE.town}`, text: "Choose a point that suits you" },
  { icon: "🔎", title: "Track your order", text: "Phone number + 4-digit code" },
];

const Chip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-display font-bold border-2 border-ink transition ${
      active ? "bg-accent-500 text-paper shadow-pop-sm" : "bg-white text-ink hover:bg-sun-300"
    }`}
  >
    {children}
  </button>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const wa = waLink();

  useEffect(() => {
    api.get("/products/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (search) params.search = search;

    const timeout = setTimeout(() => {
      api
        .get("/products", { params })
        .then((res) => setProducts(res.data.products))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [activeCategory, search]);

  const trending = useMemo(() => products.slice(0, 8), [products]);

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Carousel slides={HERO_SLIDES} />

        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          {PERKS.map((p) => (
            <div key={p.title} className="flex items-center gap-3 bg-white border-2 border-ink rounded-xl px-4 py-3">
              <span className="text-2xl">{p.icon}</span>
              <div className="leading-tight">
                <p className="font-display font-bold text-sm">{p.title}</p>
                <p className="text-xs text-ink/60">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="shop" className="max-w-6xl mx-auto px-4 pt-14 scroll-mt-20">
        <div className="mb-6">
          <p className="eyebrow mb-1">Duka letu</p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-extrabold text-4xl"
          >
            Shop the latest
          </motion.h1>
        </div>

        {/* Sticky search + category chips */}
        <div className="sticky top-[74px] z-30 -mx-4 px-4 py-3 bg-paper/95 backdrop-blur border-y-2 border-ink/10 mb-8">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tafuta... dress, sneakers, jacket"
              className="field !mt-0 pl-10"
            />
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
            <Chip active={activeCategory === ""} onClick={() => setActiveCategory("")}>Zote</Chip>
            {categories.map((cat) => (
              <Chip key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
                {cat}
              </Chip>
            ))}
          </div>
        </div>

        {!loading && !search && !activeCategory && trending.length > 0 && (
          <ProductRail products={trending} subtitle="Zinauzwa haraka" title="Trending now" />
        )}

        {loading ? (
          <Loader label="Inaleta bidhaa..." />
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display font-bold text-xl mb-1">Hakuna kitu hapa 😅</p>
            <p className="text-ink/60">No products found. Try another search.</p>
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer" className="btn-mpesa mt-5">
                Ask us on WhatsApp
              </a>
            )}
          </div>
        ) : (
          <>
            <h2 className="font-display font-extrabold text-3xl mb-5">All products</h2>
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {products.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: (i % 8) * 0.04 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
