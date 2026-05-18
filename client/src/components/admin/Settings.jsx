import React, { useState } from 'react';
import { Lock, Save, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const Settings = () => {
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/users/profile/password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="glass rounded-3xl p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Security Settings</h3>
            <p className="text-sm text-slate-500">Update your administrative password</p>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-2xl mb-6 text-sm font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Current Password</label>
            <input
              required
              type="password"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">New Password</label>
            <input
              required
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Confirm New Password</label>
            <input
              required
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-custom py-5 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? 'Updating...' : 'Save Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
