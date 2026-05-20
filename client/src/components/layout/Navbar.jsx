import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Moon, Sun, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../services/AuthContext';
import { useCart } from '../../services/CartContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-transparent backdrop-blur-md py-3 shadow-none' : 'bg-transparent py-5 dark:text-white'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-custom flex items-center justify-center font-bold text-white shadow-lg shadow-accent/20">S</div>
          <span className="text-xl font-heading font-black text-gradient uppercase tracking-tighter hidden sm:block">Shazora</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-black text-slate-700 dark:text-gray-300">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <Link to="/products" className="hover:text-accent transition-colors">Shop</Link>
          <Link to="/products/men" className="hover:text-accent transition-colors">Men</Link>
          <Link to="/products/women" className="hover:text-accent transition-colors">Women</Link>
          <Link to="/about" className="hover:text-accent transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="p-2.5 rounded-xl border border-slate-300 dark:border-white/10 hover:border-accent transition-colors bg-white/5 backdrop-blur-md"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.button>

          <div className="relative hidden md:block">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 hover:border-accent transition-all bg-white/5 backdrop-blur-md"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name || 'User'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      {user?.name?.[0] || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-bold uppercase tracking-widest">{user?.name ? user.name.split(' ')[0] : 'User'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-56 glass rounded-2xl p-2 z-[60]"
                    >
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent hover:text-white text-xs font-black uppercase tracking-widest transition-all mb-1"
                        >
                          Admin Panel
                        </Link>
                      )}

                      <Link 
                        to="/my-orders" 
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-black uppercase tracking-widest transition-all mb-1"
                      >
                        My Orders
                      </Link>
                      <Link 
                        to="/track-order" 
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-black uppercase tracking-widest transition-all mb-1"
                      >
                        Track Order
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all text-red-500"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-accent dark:hover:bg-accent dark:hover:text-white text-xs uppercase tracking-[0.2em] font-black transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          <Link 
            to="/cart" 
            className="relative p-2.5 hover:bg-slate-900/10 dark:hover:bg-white/10 rounded-xl transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-magenta rounded-full shadow-[0_0_10px_rgba(217,70,239,0.5)] flex items-center justify-center text-[8px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          
          <button 
            className="md:hidden p-2 rounded-xl border border-slate-300 dark:border-white/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass absolute top-full left-0 w-full p-6 flex flex-col gap-4 text-xs font-black uppercase tracking-[0.2em] shadow-2xl"
          >
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setIsOpen(false)}>Explore Shop</Link>
            <Link to="/products/men" onClick={() => setIsOpen(false)}>Men</Link>
            <Link to="/products/women" onClick={() => setIsOpen(false)}>Women</Link>
            <hr className="border-slate-200 dark:border-white/10 " />
            {user ? (
              <>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setIsOpen(false)}>Admin Panel</Link>}

                <Link to="/my-orders" onClick={() => setIsOpen(false)}>My Orders</Link>
                <Link to="/track-order" onClick={() => setIsOpen(false)}>Track Order</Link>
                <button 
                  onClick={async () => { await handleLogout(); setIsOpen(false); }}
                  className="text-left text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-accent">Login</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
