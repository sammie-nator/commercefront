import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { imageUrl } from "../utils/imageUrl";

const Cart = () => {
  const { items, updateQuantity, removeItem, totalAmount, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="h-20 w-20 rounded-full bg-sun-300 border-2 border-ink shadow-pop mx-auto mb-6 flex items-center justify-center text-4xl"
        >
          🧺
        </motion.div>
        <h1 className="font-display font-extrabold text-3xl mb-2">Kikapu chako ni tupu</h1>
        <p className="text-ink/60 mb-6">Your basket is empty. Let's fix that.</p>
        <Link to="/" className="btn-primary">Anza kununua →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <p className="eyebrow mb-1">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
      <h1 className="font-display font-extrabold text-4xl mb-6">Your Kikapu</h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -50 }}
                className="card flex items-center gap-4 p-3"
              >
                <img
                  src={imageUrl(item.image)}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover border-2 border-ink"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold truncate">{item.name}</p>
                  <p className="text-sm text-ink/60">KES {item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="h-8 w-8 rounded-lg border-2 border-ink bg-white font-bold hover:bg-sun-300 transition"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-display font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="h-8 w-8 rounded-lg border-2 border-ink bg-white font-bold hover:bg-sun-300 transition"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right self-stretch flex flex-col justify-between">
                  <p className="font-display font-extrabold">KES {(item.price * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-accent-600 text-xs font-semibold hover:underline"
                  >
                    Ondoa
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <aside className="card p-5 lg:sticky lg:top-28 bg-clay">
          <h2 className="font-display font-bold text-xl mb-4">Muhtasari</h2>
          <div className="flex justify-between text-sm py-1">
            <span className="text-ink/70">Subtotal</span>
            <span>KES {totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span className="text-ink/70">Pickup</span>
            <span className="font-semibold text-brand-700">Free</span>
          </div>
          <div className="flex justify-between items-baseline border-t-2 border-dashed border-ink/40 mt-3 pt-3">
            <span className="font-display font-bold">Total</span>
            <span className="font-display font-extrabold text-2xl">KES {totalAmount.toLocaleString()}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="btn-mpesa w-full mt-5">
            Endelea · Checkout
          </button>
          <Link to="/" className="block text-center text-sm font-semibold text-brand-700 mt-4 hover:underline">
            ← Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
