import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';
import { useAuth } from '../services/AuthContext';

const ForgotPassword = () => {
  const { sendResetPasswordEmail, exchangeResetPasswordToken, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('request');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendCode = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      await sendResetPasswordEmail(email.trim());
      setMessage('Code sent. Check your email and enter verification code.');
      setStep('verify');
    } catch (err) {
      setError(err?.message || 'Unable to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!verificationCode.trim() || verificationCode.trim().length < 4) {
      setError('Please enter a valid verification code.');
      return;
    }

    try {
      setLoading(true);
      const data = await exchangeResetPasswordToken(email.trim(), verificationCode.trim());
      if (!data?.token) {
        throw new Error('Verification failed. Please request a new code.');
      }
      setToken(data.token);
      setMessage('Code verified. Set your new password.');
      setStep('reset');
    } catch (err) {
      setError(err?.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('Verification token missing. Please verify code again.');
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError('Please fill all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, newPassword);
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } catch (err) {
      setError(err?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-heading font-bold mb-2 text-center">Forgot Password</h1>
        <p className="text-slate-500 text-center mb-6">
          {step === 'request' && 'Enter your email to receive verification code.'}
          {step === 'verify' && 'Enter verification code sent to your email.'}
          {step === 'reset' && 'Set your new password and continue to login.'}
        </p>

        {message && <p className="mb-4 text-sm text-emerald-500 text-center">{message}</p>}
        {error && <p className="mb-4 text-sm text-red-500 text-center">{error}</p>}

        {step === 'request' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-custom py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send code to your email'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <input
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-accent text-center tracking-[0.35em] font-bold"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-custom py-3 rounded-xl font-bold disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify code'}
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Reset password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-custom py-3 rounded-xl font-bold disabled:opacity-60"
            >
              {loading ? 'Resetting...' : 'Update password'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-accent hover:underline font-semibold">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
