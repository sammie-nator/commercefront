import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Loader from "../components/Loader";

const emptyForm = { name: "", username: "", pin: "", role: "staff" };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(form.pin)) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }
    try {
      await api.post("/admin/users", form);
      toast.success("Staff user created");
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    }
  };

  const handleResetPin = async (id) => {
    const newPin = window.prompt("Enter a new 4-digit PIN for this user:");
    if (!newPin) return;
    if (!/^\d{4}$/.test(newPin)) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }
    try {
      await api.put(`/admin/users/${id}/pin`, { pin: newPin });
      toast.success("PIN updated — they'll need to log in again");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset PIN");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this staff user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User removed");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const inp = "field !mt-0";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl">Staff & PINs</h1>
        <button onClick={() => setShowForm((s) => !s)} className={`${showForm ? "btn-ghost" : "btn-primary"} btn-sm`}>
          {showForm ? "Cancel" : "+ New Staff User"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-4 sm:p-5 mb-6 grid sm:grid-cols-2 gap-3 sm:gap-4">
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inp}
          />
          <input
            required
            placeholder="Username (for login)"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className={inp}
          />
          <input
            required
            placeholder="4-digit PIN"
            maxLength={4}
            inputMode="numeric"
            value={form.pin}
            onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })}
            className={`${inp} tracking-widest`}
          />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inp}>
            <option value="staff">Staff</option>
            <option value="owner">Owner</option>
          </select>
          <button type="submit" className="sm:col-span-2 btn-primary">
            Create Staff User
          </button>
        </form>
      )}

      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <p className="text-center text-ink/50 py-16">No staff users yet.</p>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {users.map((u) => (
              <div key={u._id} className="card p-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <p className="font-display font-bold truncate">{u.name}</p>
                    <p className="text-sm text-ink/60 truncate">@{u.username}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full border-2 border-ink bg-sun-300 text-[11px] font-display font-bold">
                    {u.role}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleResetPin(u._id)} className="btn-ghost btn-sm flex-1">
                    Reset PIN
                  </button>
                  <button onClick={() => handleDelete(u._id)} className="btn-danger btn-sm flex-1">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet+ table */}
          <div className="hidden sm:block card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-clay text-ink/70 text-left font-display">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-ink/10">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.username}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full border-2 border-ink bg-sun-300 text-[11px] font-display font-bold">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-4">
                        <button onClick={() => handleResetPin(u._id)} className="text-brand-700 font-semibold text-xs hover:underline">
                          Reset PIN
                        </button>
                        <button onClick={() => handleDelete(u._id)} className="text-accent-600 font-semibold text-xs hover:underline">
                          Remove
                        </button>
                      </div>
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

export default AdminUsers;
