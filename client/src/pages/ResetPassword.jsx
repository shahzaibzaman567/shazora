import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../services/AuthContext';

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('token') || '';
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('Missing or invalid reset token.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, newPassword);
      setMessage('Password has been reset. Redirecting to login...');
      setTimeout(() => navigate('/login', { state: { message: 'Password reset successful. Please login.' } }), 1200);
    } catch (err) {
      setError(err?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-heading font-bold mb-2 text-center">Reset Password</h1>
        <p className="text-slate-500 text-center mb-6">Choose a new password for your account.</p>

        {message && <p className="mb-4 text-sm text-emerald-500 text-center">{message}</p>}
        {error && <p className="mb-4 text-sm text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-custom py-3 rounded-xl font-bold disabled:opacity-60"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Go back to{' '}
          <Link to="/login" className="text-accent hover:underline font-semibold">
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
