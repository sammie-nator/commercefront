import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { imageUrl } from "../utils/imageUrl";
import Loader from "../components/Loader";
import { isOwner } from "./AdminAuth";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/products", { params: { limit: 100 } })
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyForm);
    setFiles([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    files.forEach((f) => fd.append("images", f));

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated");
      } else {
        await api.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created");
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      stock: p.stock,
    });
    setEditingId(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl">Products</h1>
          <p className="text-sm text-ink/60">{products.length} in the duka</p>
        </div>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={`${showForm ? "btn-ghost" : "btn-primary"} btn-sm`}
        >
          {showForm ? "Cancel" : "+ New Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-4 sm:p-5 mb-6 grid sm:grid-cols-2 gap-3 sm:gap-4">
          <h2 className="sm:col-span-2 font-display font-bold text-lg">
            {editingId ? "Edit product" : "New product"}
          </h2>
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="field !mt-0"
          />
          <input
            required
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="field !mt-0"
          />
          <input
            required
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Price (KES)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="field !mt-0"
          />
          <input
            required
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Stock quantity"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="field !mt-0"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="field !mt-0 sm:col-span-2"
            rows={3}
          />
          <div className="sm:col-span-2">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="block w-full text-sm file:mr-3 file:rounded-lg file:border-2 file:border-ink file:bg-sun-400 file:px-3 file:py-1.5 file:font-display file:font-bold"
            />
            {files.length > 0 && <p className="text-xs text-ink/60 mt-1">{files.length} image(s) selected</p>}
          </div>
          <button type="submit" className="sm:col-span-2 btn-primary">
            {editingId ? "Update Product" : "Create Product"}
          </button>
        </form>
      )}

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <p className="text-center text-ink/50 py-16">No products yet. Add your first one.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {products.map((p) => (
            <div key={p._id} className="card overflow-hidden flex flex-col min-w-0">
              <img
                src={imageUrl(p.images?.[0])}
                alt={p.name}
                className="aspect-[4/3] w-full object-cover border-b-2 border-ink"
              />
              <div className="p-3 flex flex-col flex-1">
                <p className="font-display font-bold leading-snug line-clamp-2">{p.name}</p>
                <p className="text-xs text-ink/50">{p.category}</p>
                <div className="flex flex-wrap justify-between items-center gap-x-2 mt-2 text-sm">
                  <span className="font-display font-extrabold">KES {p.price.toLocaleString()}</span>
                  <span className={p.stock <= 3 ? "text-accent-600 font-semibold" : "text-ink/60"}>
                    {p.stock} left
                  </span>
                </div>
                <div className="flex gap-2 mt-auto pt-3">
                  <button onClick={() => handleEdit(p)} className="btn-ghost btn-sm flex-1">
                    Edit
                  </button>
                  {isOwner() && (
                    <button onClick={() => handleDelete(p._id)} className="btn-danger btn-sm flex-1">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
