import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../services/AuthContext';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { googleAuthStartUrl } from '../services/mongoApi';
import { pathFromRouterFrom, peekStoredReturnTo } from '../utils/authRedirect';

const Signup = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, syncSessionUser } = useAuth();
  const navigate = useNavigate();
  const resolvedGoogleReturnTo = pathFromRouterFrom(location.state?.from) ?? peekStoredReturnTo();
  const googleSignupParams = new URLSearchParams();
  if (resolvedGoogleReturnTo) {
    googleSignupParams.set('returnTo', resolvedGoogleReturnTo);
  }
  
  const googleSignupPopupParams = new URLSearchParams(googleSignupParams);
  googleSignupPopupParams.set('popup', 'true');
  const googleSignupPopupHref = `${googleAuthStartUrl}${googleSignupPopupParams.toString() ? `?${googleSignupPopupParams.toString()}` : ''}`;

  const handleGoogleLogin = (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      googleSignupPopupHref,
      'shazora-google-auth',
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      setError('Popup blocker is enabled! Please allow popups to continue with Google.');
      setLoading(false);
      return;
    }

    let messageReceived = false;

    const handleMessage = async (msgEvent) => {
      if (msgEvent.origin !== window.location.origin) return;

      if (msgEvent.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        messageReceived = true;
        window.removeEventListener('message', handleMessage);
        clearInterval(popupCheckInterval);

        try {
          const user = await syncSessionUser();
          navigate('/', { replace: true });
        } catch (syncErr) {
          setError('Google sign-in succeeded, but we failed to sync your profile.');
        } finally {
          setLoading(false);
        }
      } else if (msgEvent.data?.type === 'GOOGLE_AUTH_FAILURE') {
        messageReceived = true;
        window.removeEventListener('message', handleMessage);
        clearInterval(popupCheckInterval);
        setError(msgEvent.data.error || 'Google sign-in failed.');
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);

    const popupCheckInterval = setInterval(async () => {
      if (popup.closed) {
        clearInterval(popupCheckInterval);
        setTimeout(async () => {
          if (!messageReceived) {
            window.removeEventListener('message', handleMessage);
            try {
              const user = await syncSessionUser();
              if (user) {
                navigate('/', { replace: true });
              } else {
                setLoading(false);
              }
            } catch {
              setLoading(false);
            }
          }
        }, 500);
      }
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      // On success, redirect to login page as requested
      navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold mb-2">Create Account</h2>
          <p className="text-slate-600 dark:text-gray-400">Join the Shazora family today</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all font-bold text-slate-700 dark:text-white shadow-sm mb-4 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          <span className="text-xs text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-10 py-3 focus:ring-2 focus:ring-accent outline-none font-bold"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-10 py-3 focus:ring-2 focus:ring-accent outline-none font-bold"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-10 py-3 focus:ring-2 focus:ring-accent outline-none font-bold"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-custom py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" state={{ from: location.state?.from }} className="text-accent hover:underline font-bold">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
