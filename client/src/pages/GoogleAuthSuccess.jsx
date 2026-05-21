import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { clearStoredReturnTo } from '../utils/authRedirect';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { syncSessionUser } = useAuth();
  const [message, setMessage] = useState('Signing you in with Google...');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const finishGoogleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        // Redirect to the Express backend /api/auth/google/callback which handles Passport OAuth
        // Do NOT strip /api — on Vercel only /api/* routes reach Express
        const backendApiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        window.location.href = `${backendApiBase}/auth/google/callback?${params.toString()}`;
        return;
      }

      const returnTo = params.get('returnTo');
      const error = params.get('error');
      const isPopup = params.get('popup') === 'true' || window.opener !== null;

      if (error) {
        const errorMessage = decodeURIComponent(error);
        if (isPopup && window.opener) {
          try {
            window.opener.postMessage({ type: 'GOOGLE_AUTH_FAILURE', error: errorMessage }, window.location.origin);
          } catch (e) {
            console.error(e);
          }
          window.close();
          return;
        }
        setIsError(true);
        setMessage(errorMessage);
        return;
      }

      try {
        const user = await syncSessionUser();
        clearStoredReturnTo();

        if (isPopup && window.opener) {
          try {
            window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, window.location.origin);
          } catch (e) {
            console.error(e);
          }
          window.close();
          return;
        }

        if (returnTo && returnTo.startsWith('/')) {
          navigate(returnTo, { replace: true });
          return;
        }

        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
          return;
        }

        navigate('/', { replace: true });
      } catch (authError) {
        const errorMessage = authError.message || 'Google sign-in failed. Please try again.';
        if (isPopup && window.opener) {
          try {
            window.opener.postMessage({ type: 'GOOGLE_AUTH_FAILURE', error: errorMessage }, window.location.origin);
          } catch (e) {
            console.error(e);
          }
          window.close();
          return;
        }
        setIsError(true);
        setMessage(errorMessage);
      }
    };

    finishGoogleAuth();
  }, [navigate, syncSessionUser]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md text-center">
        <h1 className="text-2xl font-heading font-bold mb-3">
          {isError ? 'Google Sign-In Failed' : 'Signing You In'}
        </h1>
        <p className={`text-sm ${isError ? 'text-red-500' : 'text-slate-600 dark:text-gray-400'}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
