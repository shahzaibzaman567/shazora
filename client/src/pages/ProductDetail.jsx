import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { getProductById } from '../services/api';
import { useCart } from '../services/CartContext';
import { useToast } from '../context/ToastContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        if (!cancelled) setProduct(data);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Product not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.countInStock === 0) return;
    addToCart(product, qty);
    showToast(`${qty} x ${product.name} added to cart!`);
    navigate('/cart');
  };

  const inc = () => setQty((q) => Math.min(q + 1, product?.countInStock || 99));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <p className="text-red-500 font-bold mb-4">{error || 'Product not found'}</p>
        <Link to="/products" className="text-accent font-bold underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const out = product.countInStock === 0;

  return (
    <div className="container mx-auto px-6 max-w-6xl py-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-8 text-sm font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-white/5"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="space-y-6">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-accent mb-2">
              {product.category}
            </p>
            <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-black text-accent mt-4">${Number(product.price).toFixed(2)}</p>
          </div>

          <p className="text-slate-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
            {product.description || 'Premium quality piece from Shazora.'}
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-bold">
              {out ? 'Out of stock' : `${product.countInStock} in stock`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 rounded-2xl px-4 py-3 border border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={dec}
                disabled={qty <= 1}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-white/10 disabled:opacity-40"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="font-black w-8 text-center">{qty}</span>
              <button
                type="button"
                onClick={inc}
                disabled={out || qty >= (product.countInStock || 99)}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-white/10 disabled:opacity-40"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={out}
              onClick={handleAddToCart}
              className="flex-1 min-w-[200px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to cart
            </motion.button>
          </div>

          <Link
            to="/cart"
            className="inline-block text-sm font-bold text-accent hover:underline"
          >
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
