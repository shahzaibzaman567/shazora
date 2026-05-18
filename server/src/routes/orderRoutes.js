import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';

import {
  createOrder,
  bulkUpdateOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getOrderByTrackId,
  getOrdersByPhone,
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrders);
router.route('/bulk-update').patch(protect, admin, bulkUpdateOrders);
router.route('/track/:trackId').get(getOrderByTrackId);
router.route('/phone/:phone').get(getOrdersByPhone);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;
