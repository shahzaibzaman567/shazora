import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectSession = (req, res, next) => {
  if (req.isAuthenticated?.() && req.user) {
    return next();
  }

  res.status(401);
  return next(new Error('Not authenticated'));
};

// Protect routes — cookie, Bearer token, or legacy "Bearer <jwt>" split
export const protect = async (req, res, next) => {
  if (req.isAuthenticated?.() && req.user) {
    return next();
  }

  let token;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    token = req.cookies?.jwt;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      req.user = await User.findById(decoded.userId).select('-password');
      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    next(new Error('Not authorized as an admin'));
  }
};

