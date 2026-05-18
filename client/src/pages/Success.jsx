import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const Success = () => {
  const successRef = useRef(null);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.success-card', { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.75 });
    }, successRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Get pending order ID from localStorage
    const pendingOrder = localStorage.getItem('shazora_pending_order');
    if (pendingOrder) {
      setOrderId(pendingOrder);
      localStorage.removeItem('shazora_pending_order'); // Clean up
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div ref={successRef} className="min-h-[80vh] flex flex-col items-center justify-center container mx-auto px-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ y: -5 }}
        className="success-card text-center glass rounded-3xl p-12 max-w-2xl w-full"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        
        <h1 className="text-5xl font-heading font-black uppercase mb-6 tracking-tight">Payment Successful!</h1>
        <p className="text-slate-500 max-w-md mx-auto mb-12 text-lg">
          Thank you for choosing Shazora. Your order has been confirmed and is being processed.
        </p>
        
        {orderId && (
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-3xl mb-12">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4">Your Order ID</p>
            <div className="flex items-center justify-between bg-white dark:bg-black/20 p-6 rounded-xl border border-white dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-4">
                <Package className="w-6 h-6 text-accent" />
                <code className="text-2xl font-black text-accent tracking-tighter">{orderId}</code>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(orderId)}
                className="text-[10px] uppercase font-black tracking-widest bg-slate-100 dark:bg-white/10 px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-all"
              >
                Copy
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest italic">Use this ID to track your order</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/track-order" 
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-accent transition-all flex items-center justify-center gap-3"
          >
            Track Order
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            to="/products"
            className="border border-slate-200 dark:border-white/10 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;
