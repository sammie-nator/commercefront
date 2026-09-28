import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const inputClass =
  "mt-1 w-full border border-brand-100 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 transition";

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
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="font-display italic text-3xl text-gray-900 mb-6">Checkout</h1>

      <div className="bg-white rounded-2xl border border-brand-100/70 shadow-sm p-4 mb-6">
        {items.map((i) => (
          <div key={i.productId} className="flex justify-between text-sm py-1">
            <span>
              {i.name} × {i.quantity}
            </span>
            <span>KES {(i.price * i.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold border-t border-brand-100 mt-2 pt-2">
          <span>Total</span>
          <span className="text-brand-800">KES {totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            name="customerName"
            required
            value={form.customerName}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">M-Pesa Phone Number</label>
          <input
            name="customerPhone"
            required
            placeholder="07XXXXXXXX"
            value={form.customerPhone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Pickup Location</label>
          <select
            name="pickupLocation"
            required
            value={form.pickupLocation}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc.name}>
                {loc.name}
              </option>
            ))}
            <option value="Custom">Custom location</option>
          </select>
        </div>

        {form.pickupLocation === "Custom" && (
          <div>
            <label className="text-sm font-medium text-gray-700">Describe your location</label>
            <input
              name="customLocation"
              required
              value={form.customLocation}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -2 }}
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-gradient text-white font-semibold py-3 rounded-xl shadow-glow hover:shadow-glow-lg transition disabled:opacity-60"
        >
          {submitting ? "Sending prompt..." : `Pay KES ${totalAmount.toLocaleString()} with M-Pesa`}
        </motion.button>
      </form>
    </div>
  );
};

export default Checkout;
