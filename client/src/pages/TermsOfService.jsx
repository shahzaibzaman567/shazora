import { motion } from 'framer-motion';
import { FileText, Scale, ShoppingBag, Info } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-6 max-w-4xl py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex p-4 bg-slate-100 dark:bg-white/5 rounded-2xl mb-6">
          <FileText className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-4xl font-heading font-bold mb-4">Terms of Service</h1>
        <p className="text-slate-600 dark:text-gray-400 text-lg">Rules and guidelines for using Shazora</p>
      </motion.div>

      <div className="space-y-10">
        <section className="glass p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold">1. Usage Rules</h2>
          </div>
          <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
            By accessing Shazora, you agree to comply with all local laws and regulations. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.
          </p>
        </section>

        <section className="glass p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-6 h-6 text-magenta" />
            <h2 className="text-2xl font-bold">2. Orders & Payments</h2>
          </div>
          <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
            All orders are subject to acceptance and availability. Prices are subject to change without notice. We reserves the right to refuse service, terminate accounts, or cancel orders at our sole discretion.
          </p>
        </section>

        <section className="glass p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="w-6 h-6 text-slate-400" />
            <h2 className="text-2xl font-bold">3. Limitations</h2>
          </div>
          <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
            In no event shall Shazora or its suppliers be liable for any damages arising out of the use or inability to use the materials on Shazora's website, even if notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl text-sm text-slate-500 text-center">
          Last updated: April 17, 2026
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
