import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import Loader from "../components/Loader";

const StatCard = ({ label, value, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`card p-4 sm:p-5 min-w-0 ${className}`}
  >
    <p className="text-xs sm:text-sm text-ink/60">{label}</p>
    <p className="font-display font-extrabold text-xl sm:text-2xl mt-1 break-words">{value}</p>
  </motion.div>
);

const AdminAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setData(res.data));
  }, []);

  if (!data) return <Loader label="Loading analytics..." />;

  const maxDay = Math.max(...data.salesByDay.map((d) => d.revenue), 1);

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl mb-6">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Total Revenue" value={`KES ${data.totalRevenue.toLocaleString()}`} className="col-span-2 lg:col-span-1 !bg-sun-300" />
        <StatCard label="Total Orders" value={data.totalOrders} />
        <StatCard label="Paid Orders" value={data.paidOrders} />
        <StatCard label="Pending Payment" value={data.pendingOrders} />
        <StatCard label="Low Stock Items" value={data.lowStock} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card p-4 sm:p-5 min-w-0">
          <h3 className="font-display font-bold mb-4">Revenue (last 30 days)</h3>
          <div className="flex items-end gap-[2px] sm:gap-1 h-40">
            {data.salesByDay.map((d) => (
              <div key={d._id} className="flex-1 min-w-0 flex flex-col items-center justify-end h-full">
                <div
                  className="w-full bg-brand-600 rounded-t hover:bg-accent-500 transition"
                  style={{ height: `${(d.revenue / maxDay) * 100}%` }}
                  title={`${d._id}: KES ${d.revenue}`}
                />
              </div>
            ))}
          </div>
          {data.salesByDay.length === 0 && (
            <p className="text-sm text-ink/40 text-center py-10">No sales yet.</p>
          )}
        </div>

        <div className="card p-4 sm:p-5 min-w-0">
          <h3 className="font-display font-bold mb-4">Top Products</h3>
          <div className="space-y-3">
            {data.topProducts.map((p) => (
              <div key={p._id} className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3 text-sm">
                <span className="font-semibold min-w-0 break-words">{p._id}</span>
                <span className="text-ink/60 shrink-0">
                  {p.unitsSold} sold · KES {p.revenue.toLocaleString()}
                </span>
              </div>
            ))}
            {data.topProducts.length === 0 && <p className="text-sm text-ink/40">No sales yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
