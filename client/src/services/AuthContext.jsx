import React, { createContext, useContext, useEffect, useState } from 'react';
import { mongoLogin, mongoFetchProfile, mongoLogout, isMongoConfigured, mongoApi } from './mongoApi';

const AuthContext = createContext();
const ADMIN_EMAIL = 'shahzaibzaman465@gmail.com';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
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
    mongoLogout();
    setUser(null);
  };

  const loginWithGoogle = async (googleUser) => {
    const { data } = await mongoApi.post('/users/google', {
      email: googleUser.email,
      name: googleUser.name,
      googleId: googleUser.sub || googleUser.id,
    });
    if (data.token) localStorage.setItem('shazora_jwt', data.token);
    setUser(data);
    return data;
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
        loginWithGoogle,
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
