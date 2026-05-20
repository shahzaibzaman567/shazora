import express from 'express';
import passport from 'passport';
import {
  saveReturnTo,
  completeGoogleAuth,
  failGoogleAuth,
  getCurrentUser,
  logoutUser,
} from '../controllers/authController.js';
import { protectSession } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/google', saveReturnTo, passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google/failure', session: true }),
  completeGoogleAuth
);
router.get('/google/failure', failGoogleAuth);
router.get('/me', protectSession, getCurrentUser);
router.post('/logout', logoutUser);

export default router;
