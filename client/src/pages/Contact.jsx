import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const Contact = () => {
  const contactRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-anim', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.14 });
    }, contactRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={contactRef} className="container mx-auto px-6 max-w-7xl py-16 text-slate-900 dark:text-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="contact-anim max-w-2xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl font-heading font-bold uppercase tracking-widest mb-4">Contact Us</h1>
        <p className="text-slate-600 dark:text-gray-400">
          Need help with orders, sizing, returns, or collaboration? Reach out to the Shazora support team.
          We usually reply within 24 hours with complete guidance.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="contact-anim glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">Support Details</h2>
          <p className="text-slate-600 dark:text-gray-400 mb-2">Email: support@shazora.com</p>
          <p className="text-slate-600 dark:text-gray-400 mb-2">Phone: +92 300 0000000</p>
          <p className="text-slate-600 dark:text-gray-400">Office Hours: Mon-Sat, 10:00 AM - 8:00 PM</p>
        </div>

        <div className="contact-anim glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">Business Address</h2>
          <p className="text-slate-600 dark:text-gray-400">
            Shazora Commerce Hub, Main Fashion Avenue, Lahore, Pakistan.
            This is demo text content for the e-commerce contact page.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;

