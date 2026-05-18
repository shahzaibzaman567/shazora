import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../services/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center"
        >
          <ShoppingBag className="w-10 h-10 text-slate-400" />
        </motion.div>
        <h2 className="text-2xl font-heading font-bold">Your cart is empty</h2>
        <p className="text-slate-500 max-w-xs text-center">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-accent transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 max-w-7xl py-12">
      <h1 className="text-4xl font-heading font-bold uppercase tracking-widest mb-12">Your Shopping Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass p-4 rounded-3xl flex items-center gap-6"
              >
                <div className="w-24 h-32 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-[10px] text-accent uppercase font-black tracking-widest">{item.category}</p>
                    </div>
                    <p className="font-bold text-lg">${item.price}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-1 border border-slate-100 dark:border-white/10">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="hover:text-accent p-1"><Minus className="w-4 h-4" /></button>
                      <span className="font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="hover:text-accent p-1"><Plus className="w-4 h-4" /></button>
                    </div>
                    
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-[2.5rem] sticky top-32">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-emerald-500">FREE</span>
              </div>
              <div className="h-[1px] bg-slate-100 dark:bg-white/10 w-full" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-gradient-custom py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 group"
            >
              Checkout Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-6 uppercase tracking-widest font-bold">
              Secure checkout verified by Shazora
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
