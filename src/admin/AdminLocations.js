import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const AdminLocations = () => {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState("");

  const load = () => api.get("/locations").then((res) => setLocations(res.data));
  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.post("/locations", { name });
      setName("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/locations/${id}`);
    load();
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl mb-6">Pickup Locations</h1>

      <form onSubmit={handleAdd} className="flex flex-col min-[420px]:flex-row gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Embu Town Pickup Point"
          className="field !mt-0 flex-1 text-sm"
        />
        <button type="submit" className="btn-primary btn-sm">
          Add
        </button>
      </form>

      <div className="card divide-y divide-ink/10">
        {locations.map((loc) => (
          <div key={loc._id} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0 break-words">📍 {loc.name}</span>
            <button onClick={() => handleDelete(loc._id)} className="text-accent-600 text-sm font-semibold hover:underline shrink-0">
              Remove
            </button>
          </div>
        ))}
        {locations.length === 0 && <p className="text-center text-ink/40 py-6 text-sm">No locations yet.</p>}
      </div>
    </div>
  );
};

export default AdminLocations;
