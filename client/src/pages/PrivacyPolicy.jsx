import { motion } from 'framer-motion';
import { Lock, Eye, Shield, Server } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-6 max-w-4xl py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex p-4 bg-magenta/10 rounded-2xl mb-6">
          <Shield className="w-10 h-10 text-magenta" />
        </div>
        <h1 className="text-4xl font-heading font-bold mb-4">Privacy Policy</h1>
        <p className="text-slate-600 dark:text-gray-400 text-lg">Your data security is our top priority</p>
      </motion.div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold">Data We Collect</h2>
          </div>
          <div className="glass p-8 rounded-3xl text-slate-600 dark:text-gray-400 leading-relaxed">
            <p className="mb-4">We collect information that you provide directly to us when you create an account, make a purchase, or communicate with us. This includes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Contact Information: Name, email address, phone number, and shipping address.</li>
              <li>Payment Details: Transactions history (we do not store full credit card numbers).</li>
              <li>Preferences: Wishlist items and marketing preferences.</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold">How We Use Your Data</h2>
          </div>
          <div className="glass p-8 rounded-3xl text-slate-600 dark:text-gray-400 leading-relaxed">
            <p className="mb-4">Shazora uses the collected data for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To process and deliver your orders.</li>
              <li>To provide customer support and service updates.</li>
              <li>To improve our website performance and user experience.</li>
              <li>To send promotional offers (only if you opt-in).</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-magenta" />
            <h2 className="text-2xl font-bold">Security Statement</h2>
          </div>
          <div className="glass p-8 rounded-3xl bg-magenta/5 border-magenta/10 text-slate-600 dark:text-gray-400 leading-relaxed">
            <p>
              We implement industry-standard security measures, including SSL encryption and secure firewalls, to protect your personal information from unauthorized access, alteration, or disclosure. While no system is 100% secure, we continuously monitor our infrastructure for potential vulnerabilities.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
