import { motion } from 'framer-motion';
import { RefreshCw, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="container mx-auto px-6 max-w-4xl py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex p-4 bg-accent/10 rounded-2xl mb-6">
          <RefreshCw className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-4xl font-heading font-bold mb-4">Return & Refund Policy</h1>
        <p className="text-slate-600 dark:text-gray-400 text-lg">Hassle-free returns for a better shopping experience</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="glass p-8 rounded-3xl">
          <Clock className="w-8 h-8 text-magenta mb-4" />
          <h3 className="text-xl font-bold mb-3">7-Day Window</h3>
          <p className="text-slate-600 dark:text-gray-400">
            You can return any product within 7 days of delivery. No questions asked, as long as the conditions are met.
          </p>
        </div>
        <div className="glass p-8 rounded-3xl">
          <ShieldCheck className="w-8 h-8 text-accent mb-4" />
          <h3 className="text-xl font-bold mb-3">Product Condition</h3>
          <p className="text-slate-600 dark:text-gray-400">
            Items must be unworn, unwashed, and have all original tags and packaging intact.
          </p>
        </div>
      </div>

      <div className="glass p-10 rounded-3xl space-y-8">
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-magenta" />
            Non-Returnable Items
          </h3>
          <ul className="list-disc list-inside text-slate-600 dark:text-gray-400 space-y-2 ml-2">
            <li>Innerwear and swimwear for hygiene reasons.</li>
            <li>Customized or personalized items.</li>
            <li>Items bought during "Final Clearance" sales.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">Refund Process</h3>
          <p className="text-slate-600 dark:text-gray-400 mb-4">
            Once we receive your returned item and inspect its condition, we will process your refund within 3-5 business days.
          </p>
          <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl">
            <p className="font-semibold mb-2">Refund Methods:</p>
            <ul className="text-sm text-slate-500 dark:text-gray-400 space-y-1">
              <li>• Original payment method (Credit/Debit Card, UPI)</li>
              <li>• Shazora Wallet Credits (Instant refund)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
