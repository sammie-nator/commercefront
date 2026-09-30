import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { imageUrl } from "../utils/imageUrl";
import Loader from "../components/Loader";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Inaleta bidhaa..." />;
  if (!product) return <p className="text-center py-20 font-display font-bold text-xl">Bidhaa haipatikani · Product not found.</p>;

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    navigate("/checkout");
  };

  const images = product.images || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
      <div>
        <div className="relative aspect-square bg-clay rounded-2xl border-2 border-ink shadow-pop overflow-hidden mb-4">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={imageUrl(images[activeImg])}
              alt={product.name}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              drag={images.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -60) setActiveImg((i) => Math.min(images.length - 1, i + 1));
                else if (info.offset.x > 60) setActiveImg((i) => Math.max(0, i - 1));
              }}
              className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
            />
          </AnimatePresence>
        </div>
        <div className="flex gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImg(idx)}
              className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition ${
                activeImg === idx ? "border-ink shadow-pop-sm" : "border-ink/20 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={imageUrl(img)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow">{product.category}</p>
        <h1 className="font-display font-extrabold text-4xl mt-1 leading-tight">{product.name}</h1>
        <p className="inline-block bg-sun-400 border-2 border-ink shadow-pop-sm px-4 py-1.5 font-display font-extrabold text-2xl mt-4 -rotate-1">
          KES {product.price.toLocaleString()}
        </p>
        <p className="text-ink/75 mt-5 leading-relaxed">{product.description}</p>

        <p className={`text-sm mt-4 font-semibold ${product.stock > 0 && product.stock <= 3 ? "text-accent-600" : "text-ink/60"}`}>
          {product.stock > 0 ? `${product.stock} in stock` : "Imeisha · Out of stock"}
        </p>

        {product.stock > 0 && (
          <>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-10 w-10 rounded-lg border-2 border-ink bg-white font-bold hover:bg-sun-300 transition"
              >
                −
              </button>
              <span className="w-8 text-center font-display font-bold text-lg">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="h-10 w-10 rounded-lg border-2 border-ink bg-white font-bold hover:bg-sun-300 transition"
              >
                +
              </button>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                className="btn-ghost flex-1"
              >
                Weka Kikapuni
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleBuyNow}
                className="btn-primary flex-1"
              >
                Nunua Sasa
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ProductDetail;
