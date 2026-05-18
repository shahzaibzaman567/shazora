import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const Cancel = () => {
  const cancelRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cancel-card', { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.75 });
    }, cancelRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={cancelRef} className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ y: -5 }}
        className="cancel-card text-center glass rounded-2xl p-8 max-w-lg"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 className="text-4xl font-heading font-bold mb-4">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Your payment was cancelled or failed. No charges were made.
        </p>
        <Link 
          to="/products"
          className="bg-primary text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-accent transition-colors"
        >
          Try Again
        </Link>
      </motion.div>
    </div>
  );
};

export default Cancel;
