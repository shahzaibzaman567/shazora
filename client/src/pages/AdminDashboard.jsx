import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  ClipboardList,
  LogOut,
  ChevronRight,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import Analytics from '../components/admin/Analytics';
import ProductManager from '../components/admin/ProductManager';
import OrderManager from '../components/admin/OrderManager';
import UserManager from '../components/admin/UserManager';
import Settings from '../components/admin/Settings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { logout, user } = useAuth();

  const tabs = [
    { id: 'analytics', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, component: <Analytics /> },
    { id: 'products', label: 'Products', icon: <ShoppingBag className="w-5 h-5" />, component: <ProductManager /> },
    { id: 'orders', label: 'Orders', icon: <ClipboardList className="w-5 h-5" />, component: <OrderManager /> },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" />, component: <UserManager /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" />, component: <Settings /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-primary/95 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 bg-white dark:bg-secondary border-r border-slate-200 dark:border-white/5 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-custom flex items-center justify-center font-bold text-white shadow-lg shadow-accent/20">
            S
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg leading-tight uppercase tracking-tighter">Shazora</h2>
            <p className="text-[10px] text-accent font-black uppercase tracking-widest">Admin Control</p>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                activeTab === tab.id 
                ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 dark:text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {tab.icon}
                <span className="font-bold text-sm">{tab.label}</span>
              </div>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-200 dark:border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-heading font-black uppercase tracking-tight mb-1">
              {tabs.find(t => t.id === activeTab).label}
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Welcome back, {user?.name || 'Admin'}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-secondary p-2 rounded-2xl border border-slate-200 dark:border-white/5">
            <div className="w-10 h-10 rounded-xl bg-magenta/10 flex items-center justify-center text-magenta">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="pr-4">
              <p className="text-xs font-bold leading-tight">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black">Super Admin</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabs.find(t => t.id === activeTab).component}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;

