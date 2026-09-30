import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, animate } from "framer-motion";
import { SITE, waLink } from "../config/site";

const Counter = ({ to, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="font-display font-extrabold text-5xl sm:text-6xl text-accent-500">
      {value.toLocaleString()}
      {suffix}
    </span>
  );
};

const VALUES = [
  { emoji: "♻️", title: "Thrift with pride", body: "Pre-loved pieces with a lot of life left. Good for your wallet and kinder to the planet." },
  { emoji: "🤝", title: "Uaminifu", body: "Honest photos, clear prices, real stock levels. What you see is what you collect." },
  { emoji: "📱", title: "Easy as M-Pesa", body: "Pay from your phone, choose a pickup point, track your order. No stress." },
];

// TODO: replace with your real numbers
const STATS = [
  { to: 5, suffix: "+", label: "Years serving customers" },
  { to: 12000, suffix: "+", label: "Orders fulfilled" },
  { to: 98, suffix: "%", label: "Happy customers" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const reveal = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" }, variants: fadeUp };

const About = () => {
  const wa = waLink();
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-700 text-paper">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M24 4l20 20-20 20L4 24z' fill='none' stroke='%23fbd66a' stroke-width='2'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 py-20 sm:py-28 text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-hand text-3xl text-sun-300 mb-2">
            Hadithi yetu
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-6xl leading-[1.05]"
          >
            Born in {SITE.town}.
            <br />
            <span className="text-sun-400">Dressed for Kenya.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-paper/80 mt-6 max-w-xl mx-auto leading-relaxed text-lg"
          >
            {SITE.name} started right here in {SITE.town}, at the foot of Mt Kenya, with one idea: quality thrift
            should be easy to find, fair to buy, and simple to pay for.
          </motion.p>
        </div>
        <div className="shuka-band" />
      </section>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div {...reveal} className="relative">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-accent-500 border-2 border-ink" />
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
            alt="Our shop"
            className="relative rounded-2xl border-2 border-ink object-cover w-full h-[360px]"
          />
        </motion.div>
        <motion.div {...reveal}>
          <p className="eyebrow mb-2">Why we do this</p>
          <h2 className="font-display font-extrabold text-3xl mb-4">Haba na haba, one good find at a time.</h2>
          <p className="text-ink/75 leading-relaxed mb-4">
            What began as a small, local idea has grown into a shop people across {SITE.town} trust. We hand-pick
            every piece, so each listing means something.
          </p>
          <p className="text-ink/75 leading-relaxed">
            No gimmicks, no clutter. Just a clean shop, fair prices, and real people behind every order.
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="bg-clay border-y-2 border-ink py-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2 {...reveal} className="font-display font-extrabold text-3xl text-center mb-12">
            What we stand for
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} {...reveal} transition={{ delay: i * 0.1 }} whileHover={{ y: -4, x: -2 }} className="card p-7">
                <div className="h-12 w-12 rounded-full bg-sun-400 border-2 border-ink flex items-center justify-center text-2xl mb-5">
                  {v.emoji}
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{v.title}</h3>
                <p className="text-ink/70 text-sm leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid sm:grid-cols-3 gap-10 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <Counter to={s.to} suffix={s.suffix} />
              <p className="text-ink/60 text-sm mt-2 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent-500 border-t-2 border-ink">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-paper">
          <p className="font-hand text-3xl text-sun-300">Karibu!</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-4">Ready to find something you'll love?</h2>
          <p className="text-paper/85 mb-8">Browse the collection, pay with M-Pesa, pick up in {SITE.town}.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-sun">Start shopping →</Link>
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer" className="btn-mpesa">WhatsApp us</a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
