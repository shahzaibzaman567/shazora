import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useAuth } from '../services/AuthContext';
import { Mail, Lock, LogIn, CheckCircle2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import {
  pathFromRouterFrom,
  pathFromRedirectQuery,
  peekStoredReturnTo,
  clearStoredReturnTo,
} from '../utils/authRedirect';

const POST_LOGIN_DELAY_MS = 650;

const Login = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(location.state?.message || '');
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(formRef.current, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.7 });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setIsError(false);
      setMessage('');
      
      if (!formData.email || !formData.password) {
        setIsError(true);
        setMessage('Please fill in all fields');
        setSubmitting(false);
        return;
      }

      const user = await login(formData.email, formData.password);
      setShowSuccessModal(true);

      setTimeout(() => {
        const resolved =
          pathFromRouterFrom(location.state?.from) ??
          pathFromRedirectQuery(location.search) ??
          peekStoredReturnTo();
        clearStoredReturnTo();

        if (resolved) {
          navigate(resolved);
          setShowSuccessModal(false);
          return;
        }

        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'delivery' || user.role === 'delivery_boy') {
          navigate('/delivery-dashboard');
        } else {
          navigate('/');
        }
        setShowSuccessModal(false);
      }, POST_LOGIN_DELAY_MS);
    } catch (error) {
      setIsError(true);
      setMessage(typeof error === 'string' ? error : 'User not found or incorrect password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setSubmitting(true);
        setIsError(false);
        setMessage('');

        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        const user = await loginWithGoogle(userInfo);
        setShowSuccessModal(true);

        setTimeout(() => {
          const resolved =
            pathFromRouterFrom(location.state?.from) ??
            pathFromRedirectQuery(location.search) ??
            peekStoredReturnTo();
          clearStoredReturnTo();

          if (resolved) {
            navigate(resolved);
          } else if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
          setShowSuccessModal(false);
        }, POST_LOGIN_DELAY_MS);
      } catch (error) {
        setIsError(true);
        setMessage('Google login failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    onError: () => {
      setIsError(true);
      setMessage('Google login was cancelled or failed.');
    }
  });

  return (
    <div className="container mx-auto px-6 max-w-7xl py-16 text-slate-900 dark:text-gray-200 min-h-[80vh] flex items-center justify-center">
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass rounded-3xl p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2 text-gradient">Welcome Back</h1>
          <p className="text-slate-600 dark:text-gray-400">Sign in to your Shazora account</p>
        </div>

        {message && (
          <p className={`mb-6 text-center p-3 rounded-xl border border-current bg-white/5 text-sm ${isError ? 'text-red-500' : 'text-emerald-500'}`}>
            {message}
          </p>
        )}


        {/* Google OAuth Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleGoogleLogin()}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all font-bold text-slate-700 dark:text-white shadow-sm mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          <span className="text-xs text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
          <div className="text-right -mt-2">
            <Link to="/forgot-password" className="text-xs font-bold text-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={submitting}
            className="w-full bg-gradient-custom py-4 rounded-2xl text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 mt-4"
          >
            {submitting ? 'Authenticating...' : (
              <>
                Sign In <LogIn className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-white/5 text-center space-y-3">
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              state={{ from: location.state?.from }}
              className="text-accent font-semibold hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="glass p-12 rounded-[2.5rem] flex flex-col items-center text-center max-w-sm w-full border border-white/10 shadow-3xl"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-heading font-black uppercase tracking-tight mb-2">Welcome!</h2>
              <p className="text-slate-500 dark:text-gray-400">Login successful. Taking you to Shazora...</p>
              
              <div className="mt-8 w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: POST_LOGIN_DELAY_MS / 1000, ease: 'linear' }}
                  className="h-full bg-accent"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;

