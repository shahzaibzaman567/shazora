import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Clock, CheckCircle, Truck, XCircle, Hash, Mail, User, ChevronRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { mongoApi } from '../services/mongoApi';

/* ─── Status Config ──────────────────────────────────────── */
const STEPS = [
  { key: 'PENDING',    label: 'Order Placed',     icon: Package },
  { key: 'PROCESSING', label: 'Processing',       icon: Clock },
  { key: 'SHIPPED',    label: 'Shipped',          icon: Truck },
  { key: 'DELIVERED',  label: 'Delivered',        icon: CheckCircle },
];

const STATUS_CONFIG = {
  PENDING:    { color: 'text-slate-400',   bg: 'bg-slate-100 dark:bg-slate-800' },
  PROCESSING: { color: 'text-orange-500',  bg: 'bg-orange-50 dark:bg-orange-900/20' },
  SHIPPED:    { color: 'text-accent',      bg: 'bg-accent/10' },
  DELIVERED:  { color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  CANCELLED:  { color: 'text-red-500',     bg: 'bg-red-50 dark:bg-red-900/20' },
};

/* ─── Progress Tracker ───────────────────────────────────── */
function ProgressTracker({ status }) {
  const current = STEPS.findIndex(s => s.key === status);
  if (status === 'CANCELLED') return (
    <div className="flex items-center gap-2 p-4 bg-red-500/10 rounded-2xl border border-red-500/20 mt-6">
      <XCircle className="w-5 h-5 text-red-500" />
      <span className="font-black uppercase tracking-widest text-xs text-red-500">Order Cancelled</span>
    </div>
  );
  return (
    <div className="relative mt-8">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-white/10" />
      <div className="space-y-8">
        {STEPS.map((step, i) => {
          const done = i <= current;
          const Icon = step.icon;
          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex items-center gap-6"
            >
              <div className={`z-10 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                done
                  ? 'bg-accent text-white shadow-[0_0_20px_rgba(0,210,255,0.3)]'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-300'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`font-black text-sm uppercase tracking-widest ${done ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {step.label}
                </h4>
                <p className={`text-xs mt-0.5 ${done ? 'text-accent font-bold' : 'text-slate-400'}`}>
                  {i === 0 ? 'Confirmed' : done ? 'Completed' : 'Pending'}
                </p>
              </div>
              {i === current && (
                <span className="ml-auto text-[10px] font-black uppercase tracking-widest bg-accent text-white px-3 py-1 rounded-full">
                  Current
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Order Card ─────────────────────────────────────────── */
function OrderCard({ order }) {
  const trackId = `SHZ-${order.id.slice(0, 8).toUpperCase()}`;
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const stepLabel = STEPS.find(s => s.key === order.status)?.label || order.status;
  const deliveryDate = new Date(order.created_at);
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-3xl"
    >
      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
        <div>
          <code className="text-lg font-black text-accent">{trackId}</code>
          <p className="text-xs text-slate-400 mt-0.5">
            Placed: {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.color} ${cfg.bg}`}>
            {stepLabel}
          </span>
          <p className="text-xs text-slate-400 mt-1">Est. {deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
        <span className="text-lg font-black">${Number(order.total_price).toFixed(2)}</span>
        <span className="text-xs text-slate-500">{order.order_items?.length || 0} items</span>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function TrackOrder() {
  const { user } = useAuth();
  const [mode, setMode] = useState('id'); // 'id' | 'contact'
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myOrdersLoading, setMyOrdersLoading] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Auto-load user orders if logged in
  useEffect(() => {
    if (user?.id) loadMyOrders();
  }, [user]);

  const loadMyOrders = async () => {
    setMyOrdersLoading(true);
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
      setMyOrders(normalized);
    } catch (e) {
      console.error(e);
    } finally {
      setMyOrdersLoading(false);
    }
  };

  /* Track by Order ID */
  const handleTrackById = async (e) => {
    e?.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true); setError(''); setOrderStatus(null);

    try {
      const cleanId = orderId.toUpperCase().replace('SHZ-', '').replace('#', '').trim();
      
      const res = await mongoApi.get(`/orders/track/${cleanId}`);
      const o = res.data;

      if (!o) { setError('Order not found. Please check your ID.'); return; }

      const normalized = {
        ...o,
        id: o._id || o.id,
        created_at: o.createdAt || o.created_at,
        total_price: o.totalPrice || o.total_price,
        status: o.orderStatus || o.status,
        order_items: o.orderItems || o.order_items
      };

      const orderDate = new Date(normalized.created_at);
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + 7);

      setOrderStatus({
        id: `SHZ-${normalized.id.slice(0, 8).toUpperCase()}`,
        status: normalized.status,
        date: orderDate.toLocaleDateString(),
        estimatedDelivery: deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: normalized.order_items?.map(i => i.name) || [],
        steps: STEPS,
        raw: normalized,
      });
    } catch (err) {
      setError('Order not found or an error occurred. Please check your ID.');
    } finally {
      setLoading(false);
    }
  };

  /* Track by Phone */
  const handleTrackByContact = async (e) => {
    e?.preventDefault();
    if (!contact.trim()) return;
    setLoading(true); setError(''); setOrderList([]);

    try {
      const res = await mongoApi.get(`/orders/phone/${encodeURIComponent(contact.trim())}`);
      const data = res.data || [];

      if (!data || data.length === 0) {
        setError('No orders found with this phone number.');
        return;
      }

      const normalized = data.map(o => ({
        ...o,
        id: o._id || o.id,
        created_at: o.createdAt || o.created_at,
        total_price: o.totalPrice || o.total_price,
        status: o.orderStatus || o.status,
        order_items: o.orderItems || o.order_items
      }));
      setOrderList(normalized);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-4xl py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-4xl font-heading font-black uppercase tracking-tight mb-3">Track Your Order</h1>
        <p className="text-slate-500 text-lg">Real-time order updates, multiple ways to find your order</p>
      </motion.div>

      {/* ── AUTO: Logged-in user orders ── */}
      {user && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="glass p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-black text-sm">Your Recent Orders</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Auto-detected from your account</p>
                </div>
              </div>
              <Link to="/my-orders" className="text-xs font-black uppercase tracking-widest text-accent hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {myOrdersLoading ? (
              <div className="flex justify-center py-6"><RefreshCw className="w-6 h-6 animate-spin text-accent" /></div>
            ) : myOrders.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">No orders found on your account yet.</p>
            ) : (
              <div className="space-y-3">
                {myOrders.slice(0, 3).map(order => {
                  const trackId = `SHZ-${order.id.slice(0, 8).toUpperCase()}`;
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                  const stepLabel = STEPS.find(s => s.key === order.status)?.label || order.status;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-all"
                    >
                      <div>
                        <code className="font-black text-sm text-accent">{trackId}</code>
                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>{stepLabel}</span>
                        <span className="font-black text-sm">${Number(order.total_price).toFixed(2)}</span>
                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${selectedOrder?.id === order.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Expanded order progress */}
          <AnimatePresence>
            {selectedOrder && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass rounded-3xl overflow-hidden mt-4"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <code className="text-xl font-black text-accent">SHZ-{selectedOrder.id.slice(0, 8).toUpperCase()}</code>
                    <span className="text-lg font-black">${Number(selectedOrder.total_price).toFixed(2)}</span>
                  </div>
                  <ProgressTracker status={selectedOrder.status} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── SEARCH TABS ── */}
      <div className="glass rounded-3xl overflow-hidden mb-8">
        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 dark:border-white/5">
          {[
            { id: 'id', label: 'Order ID', icon: Hash },
            { id: 'contact', label: 'Phone Number', icon: Mail },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setMode(tab.id); setError(''); setOrderStatus(null); setOrderList([]); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                  mode === tab.id
                    ? 'bg-accent text-white'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Mode: Order ID */}
          {mode === 'id' && (
            <form onSubmit={handleTrackById} className="flex gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="e.g. SHZ-3CD80562"
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-accent outline-none font-bold"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-custom px-8 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </form>
          )}

          {/* Mode: Phone */}
          {mode === 'contact' && (
            <form onSubmit={handleTrackByContact} className="flex gap-3">
              <div className="relative flex-grow">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Phone number used at checkout"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-accent outline-none font-bold"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-custom px-8 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Find'}
              </button>
            </form>
          )}

          {/* Not logged in helper */}
          {!user && (
            <p className="text-center text-xs text-slate-400 mt-4">
              💡 <Link to="/login" className="text-accent hover:underline font-bold">Sign in</Link> to automatically see all your orders, or use My Orders page.
            </p>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-4 rounded-2xl border border-red-500/20 text-red-500 text-center mb-6 font-bold text-sm">
          {error}
        </motion.div>
      )}

      {/* Order ID Results */}
      {orderStatus && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Tracking</p>
              <code className="text-2xl font-black text-accent">{orderStatus.id}</code>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Est. Delivery</p>
              <p className="text-lg font-black text-accent">{orderStatus.estimatedDelivery}</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-2">Placed: {orderStatus.date}</p>
          {orderStatus.items.length > 0 && (
            <p className="text-xs text-slate-400">Items: {orderStatus.items.join(', ')}</p>
          )}
          <ProgressTracker status={orderStatus.raw.status} />
        </motion.div>
      )}

      {/* Contact Search Results */}
      {orderList.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="font-black uppercase tracking-widest text-xs text-slate-400 px-1">
            {orderList.length} order{orderList.length !== 1 ? 's' : ''} found
          </h3>
          {orderList.map(order => <OrderCard key={order.id} order={order} />)}
        </motion.div>
      )}
    </div>
  );
}
