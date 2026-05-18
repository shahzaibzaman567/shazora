import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-slate-200 dark:bg-primary text-slate-700 dark:text-white py-12 mt-auto transition-colors duration-300"
    >
      <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-heading font-bold mb-4 uppercase tracking-widest">Shazora</h3>
          <p className="text-slate-600 dark:text-gray-400 max-w-sm">
            Experience premium fashion and e-commerce like never before. 
            Elevating your shopping experience with the power of modern web technologies.
          </p>
        </div>
        
        <div>
          <h4 className="font-heading font-semibold mb-4 text-accent">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-accent transition-colors">Shop</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-heading font-semibold mb-4 text-accent">Customer Care</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            <li><Link to="/track-order" className="hover:text-accent transition-colors">Track Order</Link></li>
            <li><Link to="/return-policy" className="hover:text-accent transition-colors">Returns</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 max-w-7xl mt-12 pt-8 border-t border-slate-400/30 dark:border-white/10 text-center text-xs text-slate-500 dark:text-gray-500 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Shazora. All rights reserved.</p>
        <div className="mt-4 md:mt-0 flex gap-4">
          <Link to="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
