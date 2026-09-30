import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const inputClass = "field";

const Checkout = () => {
  const { items, totalAmount, guestId } = useCart();
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    pickupLocation: "",
    customLocation: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/locations").then((res) => setLocations(res.data)).catch(() => {});
  }, []);

  // Empty cart → back to cart (unless we just came from a successful order)
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  if (items.length === 0) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        guestId,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        ...form,
      };
      const res = await api.post("/orders", payload);

      // Backend returns checkoutId (not an order yet — order is created only after M-Pesa confirms)
      const checkoutId = res.data.checkoutId;
      if (!checkoutId) {
        throw new Error("No checkout ID returned");
      }

      toast.success("Check your phone for the M-Pesa prompt");
      // Hand off to the confirmation page which polls until success or failure
      navigate(`/order/${checkoutId}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to start payment";
      toast.error(msg);
      // If STK push failed immediately, backend may still return a failed checkoutId
      const failedId = err.response?.data?.checkoutId;
      if (failedId) {
        navigate(`/order/${failedId}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <p className="eyebrow mb-1">Hatua ya mwisho</p>
      <h1 className="font-display font-extrabold text-4xl mb-6">Checkout</h1>

      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <form onSubmit={handleSubmit} className="card p-5 sm:p-6 space-y-4 order-2 md:order-1">
          <div>
            <label className="text-sm font-display font-bold">Full Name / Jina</label>
            <input name="customerName" required value={form.customerName} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="text-sm font-display font-bold">M-Pesa Phone Number</label>
            <input
              name="customerPhone"
              required
              inputMode="tel"
              placeholder="07XXXXXXXX"
              value={form.customerPhone}
              onChange={handleChange}
              className={inputClass}
            />
            <p className="text-xs text-ink/50 mt-1">The STK prompt will be sent to this number.</p>
          </div>

          <div>
            <label className="text-sm font-display font-bold">Pickup Location</label>
            <select name="pickupLocation" required value={form.pickupLocation} onChange={handleChange} className={inputClass}>
              <option value="">Select a location</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc.name}>{loc.name}</option>
              ))}
              <option value="Custom">Custom location</option>
            </select>
          </div>

          {form.pickupLocation === "Custom" && (
            <div>
              <label className="text-sm font-display font-bold">Describe your location</label>
              <input name="customLocation" required value={form.customLocation} onChange={handleChange} className={inputClass} />
            </div>
          )}

          <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={submitting} className="btn-mpesa w-full !py-3.5 text-base">
            {submitting ? "Inatuma ombi..." : `Lipa KES ${totalAmount.toLocaleString()} na M-Pesa`}
          </motion.button>
        </form>

        <aside className="card p-5 bg-clay order-1 md:order-2 md:sticky md:top-28">
          <h2 className="font-display font-bold text-xl mb-3">Your order</h2>
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between gap-3 text-sm py-1.5">
              <span className="min-w-0 truncate">{i.name} × {i.quantity}</span>
              <span className="shrink-0">KES {(i.price * i.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between items-baseline border-t-2 border-dashed border-ink/40 mt-3 pt-3">
            <span className="font-display font-bold">Total</span>
            <span className="font-display font-extrabold text-2xl">KES {totalAmount.toLocaleString()}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
