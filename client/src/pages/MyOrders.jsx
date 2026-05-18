import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag, RefreshCw, Clock, Truck, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import { isMongoConfigured, mongoApi } from '../services/mongoApi';
import React from 'react';

const STATUS_CONFIG = {
  PENDING:    { label: 'Order Placed',  icon: <Package className="w-4 h-4" />,     color: 'text-slate-500',   bg: 'bg-slate-100 dark:bg-slate-800' },
  PROCESSING: { label: 'Processing',   icon: <Clock className="w-4 h-4" />,        color: 'text-orange-500',  bg: 'bg-orange-50 dark:bg-orange-900/20' },
  SHIPPED:    { label: 'Shipped',      icon: <Truck className="w-4 h-4" />,        color: 'text-accent',      bg: 'bg-accent/10' },
  DELIVERED:  { label: 'Delivered',   icon: <CheckCircle className="w-4 h-4" />,   color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  CANCELLED:  { label: 'Cancelled',   icon: <XCircle className="w-4 h-4" />,       color: 'text-red-500',     bg: 'bg-red-50 dark:bg-red-900/20' },
};

const STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.color} ${cfg.bg}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function ProgressBar({ status }) {
  const current = STEPS.indexOf(status);
  if (status === 'CANCELLED') return (
    <div className="flex items-center gap-2 mt-3">
      <XCircle className="w-4 h-4 text-red-500" />
      <span className="text-xs text-red-500 font-bold">Order Cancelled</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1 mt-3">
      {STEPS.map((step, i) => {
        const done = i <= current;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all ${done ? 'bg-accent shadow-[0_0_6px_rgba(0,210,255,0.6)]' : 'bg-slate-200 dark:bg-white/10'}`} />
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${i < current ? 'bg-accent' : 'bg-slate-200 dark:bg-white/10'}`} />
            )}
          </div>
        );
      })}
      <span className="text-[10px] text-slate-500 ml-2 whitespace-nowrap font-bold">
        {STATUS_CONFIG[status]?.label || 'Pending'}
      </span>
    </div>
  );
}

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await mongoApi.get('/orders/myorders');
      const data = res.data?.all || [];

      const normalized = data.map(o => ({
        ...o,
        id: o._id || o.id,
        created_at: o.createdAt || o.created_at,
        total_price: o.totalPrice || o.total_price,
        status: o.orderStatus || o.status,
        order_items: o.orderItems || o.order_items
      }));

      setOrders(normalized);
    } catch (e) {
      console.error(e);
      setError('Could not load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <ShoppingBag className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-heading font-bold mb-2">Login Required</h1>
        <p className="text-slate-500 mb-6">Please sign in to view your orders.</p>
        <Link to="/login" className="bg-gradient-custom px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 max-w-4xl py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-heading font-black uppercase tracking-tight mb-2">My Orders</h1>
        <p className="text-slate-500">All your Shazora purchases in one place</p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <RefreshCw className="w-10 h-10 animate-spin text-accent" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="glass p-6 rounded-2xl text-center text-red-500 font-bold">{error}</div>
      ) : orders.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
          <ShoppingBag className="w-20 h-20 text-slate-200 dark:text-white/10 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2 text-slate-400">No orders yet</h2>
          <p className="text-slate-500 mb-8">Your purchases will appear here once you place an order.</p>
          <Link to="/products" className="bg-gradient-custom px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm">
            Shop Now
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Refresh */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-500 font-bold">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
            <button onClick={fetchOrders} className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-accent transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {orders.map((order, i) => {
            const trackId = `SHZ-${order.id.slice(0, 8).toUpperCase()}`;
            const isExpanded = expanded === order.id;
            const items = order.order_items || [];

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-3xl overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <code className="text-sm font-black text-accent tracking-tighter">{trackId}</code>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <span className="text-lg font-black">${Number(order.total_price).toFixed(2)}</span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <ProgressBar status={order.status} />

                  {/* Item thumbnails */}
                  <div className="flex items-center gap-2 mt-4">
                    {items.slice(0, 4).map((item, j) => (
                      <div key={j} className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-4 h-4 m-3 text-slate-300" />
                        )}
                      </div>
                    ))}
                    {items.length > 4 && (
                      <span className="text-xs font-bold text-slate-400">+{items.length - 4} more</span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-slate-100 dark:border-white/5 pt-4 space-y-4">

                        {/* Items list */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Items Ordered</h4>
                          {items.map((item, j) => (
                            <div key={j} className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 flex-shrink-0">
                                {item.image
                                  ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  : <Package className="w-6 h-6 m-4 text-slate-300" />
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate">{item.name}</p>
                                <p className="text-xs text-slate-500">Qty: {item.qty || 1}</p>
                              </div>
                              <span className="font-black text-sm">${(item.price * (item.qty || 1)).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Shipping */}
                        {order.shipping_address && (
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Shipping To</h4>
                            <p className="text-sm text-slate-600 dark:text-gray-300">
                              {order.shipping_address.address}, {order.shipping_address.city}
                              {order.shipping_address.zip && `, ${order.shipping_address.zip}`}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                          <Link
                            to="/track-order"
                            onClick={() => {
                              const el = document.querySelector('input[placeholder*="Order ID"]');
                              if (el) { el.value = trackId; el.dispatchEvent(new Event('input', { bubbles: true })); }
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-custom rounded-2xl text-xs font-black uppercase tracking-widest"
                          >
                            Track Order <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => navigator.clipboard.writeText(trackId)}
                            className="px-5 py-2.5 glass rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-accent transition-colors"
                          >
                            Copy ID
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
