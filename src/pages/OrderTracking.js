import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";

const STATUS_STEPS = ["paid", "processing", "ready", "completed"];
const STATUS_LABELS = {
  pending_payment: "Awaiting Payment",
  paid: "Payment Confirmed",
  processing: "Preparing Order",
  ready: "Ready for Pickup",
  completed: "Completed",
  cancelled: "Cancelled",
};

const inputClass = "field";

const OrderTracking = () => {
  const [params] = useSearchParams();
  const [phone, setPhone] = useState(params.get("phone") || "");
  const [code, setCode] = useState(params.get("code") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrder(null);
    try {
      const res = await api.get("/orders/track", { params: { phone, code } });
      setOrder(res.data.order);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order not found");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <p className="eyebrow mb-1">Fuatilia</p>
      <h1 className="font-display font-extrabold text-4xl mb-6">Track your order</h1>

      <form onSubmit={handleSearch} className="card p-5 space-y-4 mb-8">
        <div>
          <label className="text-sm font-display font-bold">Phone Number</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07XXXXXXXX"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-sm font-display font-bold">4-Digit Tracking Code</label>
          <input
            required
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`${inputClass} tracking-widest`}
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Searching..." : "Track Order"}
        </motion.button>
      </form>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 bg-clay"
        >
          <p className="text-sm text-ink/60">Order for {order.customerName}</p>
          <p className="font-display font-extrabold text-2xl mb-4">
            {STATUS_LABELS[order.status]}
          </p>

          {order.status !== "cancelled" && order.status !== "pending_payment" && (
            <div className="flex items-center justify-between mb-6">
              {STATUS_STEPS.map((step, idx) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={false}
                      animate={{ scale: idx === currentStepIndex ? 1.3 : 1 }}
                      className={`h-4 w-4 rounded-full border-2 border-ink ${
                        idx <= currentStepIndex ? "bg-brand-600" : "bg-white"
                      }`}
                    />
                    <span className="text-[10px] text-ink/60 font-semibold mt-1 text-center">
                      {STATUS_LABELS[step]}
                    </span>
                  </div>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div
                      className={`h-[3px] flex-1 -mt-4 ${
                        idx < currentStepIndex ? "bg-brand-600" : "bg-ink/15"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="border-t-2 border-dashed border-ink/30 pt-4 space-y-1 text-sm">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>KES {(i.price * i.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2">
              <span>Total</span>
              <span className="text-ink font-display">KES {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-ink/50 mt-4">
            Pickup: {order.pickupLocation === "Custom" ? order.customLocation : order.pickupLocation}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default OrderTracking;
