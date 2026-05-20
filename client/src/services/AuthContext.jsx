import { createContext, useContext, useEffect, useState } from 'react';
import {
  mongoLogin,
  mongoFetchProfile,
  fetchSessionProfile,
  mongoLogout,
  sessionLogout,
  mongoApi,
} from './mongoApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      try {
        const sessionUser = await fetchSessionProfile();
        setUser(sessionUser);
        return;
      } catch {
        // fall through to JWT auth
      }

      const token = localStorage.getItem('shazora_jwt');
      if (token) {
        const mongoUser = await mongoFetchProfile();
        setUser(mongoUser);
      } else {
        setUser(null);
      }
    } catch {
      localStorage.removeItem('shazora_jwt');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const mongoUser = await mongoLogin(email, password);
    setUser(mongoUser);
    return mongoUser;
  };

  const signup = async (name, email, password) => {
    const { data } = await mongoApi.post('/users', { name, email, password });
    // User requested to redirect to login after signup instead of auto-login
    return data;
  };

  const logout = async () => {
    try {
      await sessionLogout();
    } catch {
      // ignore logout session failures and clear client state anyway
    }
    mongoLogout();
    setUser(null);
  };

  const syncSessionUser = async () => {
    const sessionUser = await fetchSessionProfile();
    setUser(sessionUser);
    return sessionUser;
  };

  const sendResetPasswordEmail = async (email) => {
    const { data } = await mongoApi.post('/users/forgot-password', { email });
    return data;
  };

  const exchangeResetPasswordToken = async (email, code) => {
    // Actually verify with backend - will throw if OTP is wrong/expired
    await mongoApi.post('/users/verify-otp', { email, otp: code });
    // Only if above succeeds, build the token
    return { token: `${email}|${code}` };
  };

  const resetPassword = async (token, newPassword) => {
    const [email, otp] = token.split('|');
    const { data } = await mongoApi.post('/users/reset-password', { email, otp, newPassword });
    return data;
  };

  const verifyEmail = async () => {
    throw new Error('Email verification not needed with MongoDB auth.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        syncSessionUser,
        signup,
        logout,
        verifyEmail,
        sendResetPasswordEmail,
        exchangeResetPasswordToken,
        resetPassword,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
