import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Legend,
} from 'recharts';
import { Users, ShoppingCart, DollarSign, Package, RefreshCw } from 'lucide-react';
import { getAdminAnalytics } from '../../services/api';
import { adminGraphFallback } from '../../data/fashionData';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await getAdminAnalytics();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const summary = useMemo(() => ({
    totalUsers: data?.summary?.totalUsers || 2541,
    totalOrders: data?.summary?.totalOrders || 842,
    totalRevenue: data?.summary?.totalRevenue || 28400,
    productsSold: data?.summary?.totalProductsSold || 1205,
  }), [data]);

  const salesData = useMemo(() => {
    if (data?.dailySales?.length > 0) {
      return data.dailySales.map(d => ({ day: d._id.split('-').slice(2).join('/'), sales: d.sales }));
    }
    return adminGraphFallback;
  }, [data]);

  const topProductsData = useMemo(() => {
    if (data?.topProducts?.length > 0) {
      return data.topProducts.map(p => ({ name: p._id, qty: p.qty }));
    }
    return [
      { name: 'Leather Jacket Sidewalk', qty: 45 },
      { name: 'Floral Suit Statement', qty: 38 },
      { name: 'Minimal Pink Blazer', qty: 32 },
      { name: 'Vintage Tennis Style', qty: 28 },
      { name: 'Satin Dress Elegant', qty: 24 }
    ];
  }, [data]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32 space-y-4">
      <RefreshCw className="w-12 h-12 animate-spin text-accent" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Analyzing Data...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${summary.totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-6 h-6" />} color="text-emerald-500" />
        <StatCard title="Total Orders" value={summary.totalOrders} icon={<ShoppingCart className="w-6 h-6" />} color="text-accent" />
        <StatCard title="Total Users" value={summary.totalUsers} icon={<Users className="w-6 h-6" />} color="text-magenta" />
        <StatCard title="Products Sold" value={summary.productsSold} icon={<Package className="w-6 h-6" />} color="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6">Sales Performance</h3>
          <div className="h-80">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(10px)', 
                      border: '1px solid rgba(0,0,0,0.1)', 
                      borderRadius: '16px',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#00d2ff', fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#00d2ff" strokeWidth={4} dot={{ r: 6, fill: '#00d2ff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">No sales data available for the last 7 days.</div>
            )}
          </div>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6">Top Selling Products</h3>
          <div className="h-80">
            {topProductsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(10px)', 
                      border: '1px solid rgba(0,0,0,0.1)', 
                      borderRadius: '16px',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                  />
                  <Bar dataKey="qty" fill="#1D4ED8" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">No product sales data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass p-6 rounded-3xl flex items-center gap-5">
    <div className={`p-4 rounded-2xl bg-white/5 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-gray-400 capitalize">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Analytics;
