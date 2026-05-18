import express from 'express';
import { 
  getAdminAnalytics, 
  getAllUsers, 
  getAllOrders, 
  updateOrderStatus,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/analytics').get(protect, admin, getAdminAnalytics);
router.route('/users').get(protect, admin, getAllUsers);
router.route('/orders').get(protect, admin, getAllOrders);
router.route('/orders/:id/status').put(protect, admin, updateOrderStatus);

export default router;
