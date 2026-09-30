import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Loader from "../components/Loader";

const STATUS_OPTIONS = [
  "pending_payment",
  "paid",
  "processing",
  "ready",
  "completed",
  "cancelled",
];

const STATUS_STYLE = {
  pending_payment: "bg-sun-300",
  paid: "bg-brand-200",
  processing: "bg-sun-400",
  ready: "bg-brand-300",
  completed: "bg-brand-600 text-paper",
  cancelled: "bg-accent-200",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-2.5 py-0.5 rounded-full border-2 border-ink text-[11px] font-display font-bold whitespace-nowrap ${
      STATUS_STYLE[status] || "bg-white"
    }`}
  >
    {status.replace("_", " ")}
  </span>
);

const StatusSelect = ({ onChange }) => (
  <select
    defaultValue=""
    onChange={(e) => {
      if (e.target.value) {
        onChange(e.target.value);
        e.target.value = "";
      }
    }}
    className="field !mt-0 !py-1.5 !px-2 text-xs"
  >
    <option value="">Change...</option>
    {STATUS_OPTIONS.map((s) => (
      <option key={s} value={s}>
        {s}
      </option>
    ))}
  </select>
);

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/orders", { params: statusFilter ? { status: statusFilter } : {} })
      .then((res) => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success("Order updated");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const place = (o) => (o.pickupLocation === "Custom" ? o.customLocation : o.pickupLocation);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="field !mt-0 !w-auto min-w-[10rem] text-sm"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <p className="text-center text-ink/50 py-16">No orders found.</p>
      ) : (
        <>
          {/* Phones & small tablets: one card per order */}
          <div className="md:hidden space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-lg leading-none">{o.trackingCode}</p>
                    <p className="font-display font-bold mt-1 truncate">{o.customerName}</p>
                    <a href={`tel:${o.customerPhone}`} className="text-sm text-brand-700 underline">
                      {o.customerPhone}
                    </a>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="flex justify-between gap-3 text-sm mt-3 pt-3 border-t-2 border-dashed border-ink/20">
                  <span className="text-ink/60 min-w-0 break-words">📍 {place(o)}</span>
                  <span className="font-display font-extrabold shrink-0">KES {o.totalAmount.toLocaleString()}</span>
                </div>
                <div className="mt-3">
                  <StatusSelect onChange={(s) => updateStatus(o._id, s)} />
                </div>
              </div>
            ))}
          </div>

          {/* Tablet+ : table, scrolls inside its own box if it ever overflows */}
          <div className="hidden md:block card overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="bg-clay text-ink/70 text-left font-display">
                <tr>
                  {["Code", "Customer", "Phone", "Total", "Location", "Status", "Update"].map((h) => (
                    <th key={h} className="px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-t border-ink/10">
                    <td className="px-4 py-3 font-mono font-bold">{o.trackingCode}</td>
                    <td className="px-4 py-3">{o.customerName}</td>
                    <td className="px-4 py-3">{o.customerPhone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">KES {o.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">{place(o)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect onChange={(s) => updateStatus(o._id, s)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
