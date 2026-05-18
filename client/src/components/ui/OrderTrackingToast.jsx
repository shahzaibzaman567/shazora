import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, X, Copy, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderTrackingToast = () => {
  const [orderId, setOrderId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const checkForOrder = () => {
      const pending = localStorage.getItem('shazora_pending_order');
      if (pending) setOrderId(pending);
    };

    checkForOrder();

    // Also check when localStorage changes (e.g. new order placed)
    window.addEventListener('storage', checkForOrder);
    // Poll every 2s for same-tab changes
    const interval = setInterval(checkForOrder, 2000);

    return () => {
      window.removeEventListener('storage', checkForOrder);
      clearInterval(interval);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDismiss = () => {
    localStorage.removeItem('shazora_pending_order');
    setOrderId(null);
  };

  if (!orderId) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="order-toast"
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 80, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-6 z-[999] max-w-xs w-full"
      >
        <div className="bg-slate-900 text-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-accent/20 flex items-center justify-center">
                <Package className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-white">Order Placed!</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMinimized(!minimized)}
                className="text-white/40 hover:text-white transition-colors text-xs font-bold"
              >
                {minimized ? '▲' : '▼'}
              </button>
              <button
                onClick={handleDismiss}
                className="text-white/40 hover:text-red-400 transition-colors"
                title="Dismiss (order ID will be lost)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {!minimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-5 py-4 space-y-3">
                  <p className="text-[11px] text-white/50 uppercase font-bold tracking-widest">Your Tracking ID</p>

                  {/* ID display + copy */}
                  <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                    <code className="flex-1 text-lg font-black text-accent tracking-tighter">{orderId}</code>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      title="Copy ID"
                    >
                      {copied
                        ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                        : <Copy className="w-4 h-4 text-white/50" />
                      }
                    </button>
                  </div>

                  <p className="text-[10px] text-white/30 leading-relaxed">
                    Save this ID to track your order. It will disappear once you dismiss it.
                  </p>

                  <Link
                    to={`/track-order`}
                    onClick={handleDismiss}
                    className="flex items-center justify-center gap-2 w-full bg-accent/20 hover:bg-accent text-accent hover:text-white py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all group"
                  >
                    Track Order
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderTrackingToast;
