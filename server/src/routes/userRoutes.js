import express from 'express';
import { 
  authUser, 
  registerUser, 
  getUserProfile, 
  addRecentlyViewed, 
  toggleWishlist,
  updatePassword,
  updateUserRole,
  forgotPassword,
  resetPassword,
  verifyOTP,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.patch('/:id/role', protect, admin, updateUserRole);
router.route('/profile').get(protect, getUserProfile);
router.route('/profile/password').put(protect, updatePassword);
router.route('/wishlist').post(protect, toggleWishlist);
router.route('/recently-viewed').post(protect, addRecentlyViewed);

export default router;
