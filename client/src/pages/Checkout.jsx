import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../services/CartContext';
import { useAuth } from '../services/AuthContext';
import { createOrder, createCheckoutSession } from '../services/api';
import { isMongoConfigured } from '../services/mongoApi';
import { RETURN_TO_STORAGE_KEY } from '../utils/authRedirect';

const DEFAULT_FORM = {
  address: '',
  phone: '',
  city: '',
  zip: '',
  country: 'United States',
};

function getApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!configuredBaseUrl) return '/api';
  if (typeof window !== 'undefined') {
    const appHost = window.location.hostname;
    const runningLocally = appHost === 'localhost' || appHost === '127.0.0.1';
    if (!runningLocally && /localhost|127\.0\.0\.1/i.test(configuredBaseUrl)) {
      return '/api';
    }
  }
  return configuredBaseUrl.replace(/\/+$/, '');
}

function loadCheckoutFormFromStorage() {
  try {
    const saved = localStorage.getItem('checkout_form');
    if (!saved) return DEFAULT_FORM;
    const parsed = JSON.parse(saved);
    return { ...DEFAULT_FORM, ...parsed };
  } catch {
    return DEFAULT_FORM;
  }
}

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState(loadCheckoutFormFromStorage);

  // Authentication protection - redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      try {
        sessionStorage.setItem(RETURN_TO_STORAGE_KEY, '/checkout');
      } catch {
        /* ignore */
      }
      navigate(
        { pathname: '/login', search: '?redirect=checkout' },
        { state: { from: '/checkout' } }
      );
    }
  }, [user, authLoading, navigate]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  // Persistence: Save to localStorage when user edits (initial state already hydrated synchronously)
  useEffect(() => {
    localStorage.setItem('checkout_form', JSON.stringify(formData));
  }, [formData]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      try {
        sessionStorage.setItem(RETURN_TO_STORAGE_KEY, '/checkout');
      } catch {
        /* ignore */
      }
      navigate(
        { pathname: '/login', search: '?redirect=checkout' },
        { state: { from: '/checkout' } }
      );
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        userId: user.id,
        totalPrice: cartTotal,
        shippingAddress: formData,
        orderItems: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image
        }))
      };

      const orderData = await createOrder(orderPayload);
      const id = orderData._id || orderData.id;
      const trackId = `SHZ-${id.slice(0, 8).toUpperCase()}`;
      setOrderId(id);
      
      const sessionData = await createCheckoutSession(cartItems, id);
      
      clearCart();
      localStorage.removeItem('checkout_form'); // Clear form data
      localStorage.setItem('shazora_pending_order', trackId); // Persist tracking ID
      
      // Redirect to Stripe Checkout
      if (sessionData.url && sessionData.url !== '#') {
        window.location.href = sessionData.url;
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-4xl font-heading font-black uppercase mb-4 tracking-tight">Order Successful!</h1>
        <p className="text-slate-500 max-w-md mb-8">
          Thank you for choosing Shazora. your order has been placed and is being processed. 
        </p>
        
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-3xl mb-12 w-full max-w-sm">
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Your Order ID</p>
          <div className="flex items-center justify-between bg-white dark:bg-black/20 p-4 rounded-xl border border-white dark:border-white/5 shadow-sm">
            <code className="text-xl font-black text-accent tracking-tighter">SHZ-{orderId.slice(0, 8).toUpperCase()}</code>
            <button 
              onClick={() => navigator.clipboard.writeText(`SHZ-${orderId.slice(0, 8).toUpperCase()}`)}
              className="text-[10px] uppercase font-black tracking-widest bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-lg hover:bg-accent hover:text-white transition-all"
            >
              Copy
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest italic">Use this ID to track your order</p>
        </div>

        <div className="flex gap-4">
          <Link to="/products" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent transition-all">
            Continue Shopping
          </Link>
          <Link to="/track-order" className="border border-slate-200 dark:border-white/10 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
            Track Order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 max-w-7xl py-12">
      <div className="mb-12">
        <Link to="/cart" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent transition-colors mb-4 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Cart
        </Link>
        <h1 className="text-4xl font-heading font-bold uppercase tracking-widest">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Shipping Form */}
        <div>
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Truck className="w-6 h-6 text-accent" /> Shipping Details
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-black tracking-widest text-slate-400">Street Address</label>
                  <input 
                    required
                    type="text" 
                    placeholder="123 Modern Ave"
                    className="w-full glass px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent transition-all"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-black tracking-widest text-slate-400">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="+1 234 567 890"
                      className="w-full glass px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent transition-all"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-black tracking-widest text-slate-400">City</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. New York"
                      className="w-full glass px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent transition-all"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-black tracking-widest text-slate-400">Postal Code (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 10001"
                    className="w-full glass px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent transition-all opacity-70 focus:opacity-100"
                    value={formData.zip}
                    onChange={(e) => setFormData({...formData, zip: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-accent" /> Payment Method
              </h2>
              <div className="p-6 rounded-[2rem] border-2 border-accent bg-accent/5 flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <CreditCard className="w-6 h-6 text-slate-800" />
                  </div>
                  <div>
                    <h4 className="font-bold">Credit / Debit Card</h4>
                    <p className="text-xs text-slate-500">Secured by Stripe</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-4 border-accent bg-white" />
              </div>
            </div>
          </form>
        </div>

        {/* Totals and Place Order */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem]">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-slate-100 dark:bg-white/5 flex items-center justify-center font-bold text-[10px]">{item.qty}x</span>
                    <span className="text-slate-600 dark:text-gray-300">{item.name}</span>
                  </div>
                  <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="h-[1px] bg-slate-100 dark:bg-white/10 w-full my-6" />
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-2xl font-black">
                <span>Total Due</span>
                <span className="text-accent">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              form="checkout-form"
              type="submit"
              disabled={loading}
              className={`w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${loading ? 'opacity-70' : 'hover:scale-[1.02]'}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay securely via Stripe
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </>
              )}
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
               <ShieldCheck className="w-4 h-4" />
               <span className="text-[10px] uppercase font-black tracking-widest">SSL Encrypted Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
