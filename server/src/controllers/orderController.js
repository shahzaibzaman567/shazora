import Order from '../models/Order.js';
import User from '../models/User.js';

const BULK_STATUSES = ['pending', 'delivered', 'cancelled'];

const STATUS_TO_LEGACY = {
  pending: 'PENDING',
  delivered: 'DELIVERED',
  cancelled: 'CANCELLED',
};

const normalizeBulkStatus = (status) => {
  if (!status || typeof status !== 'string') return null;
  const normalized = status.trim().toLowerCase();
  return BULK_STATUSES.includes(normalized) ? normalized : null;
};

// @desc    Get logged in user orders with grouped statuses
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    // Grouping for intuitive UI consumption
    const groupedOrders = {
      active: orders.filter(
        order => ['PENDING', 'PROCESSING', 'SHIPPED'].includes(order.orderStatus)
      ),
      past: orders.filter(
        order => order.orderStatus === 'DELIVERED'
      ),
      cancelled: orders.filter(
        order => order.orderStatus === 'CANCELLED'
      ),
      all: orders
    };

    res.json(groupedOrders);
  } catch (err) { next(err); }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      // Ensure user owns order or is admin
      if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
        res.json(order);
      } else {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (err) { next(err); }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = status;
      if (status === 'DELIVERED') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (err) { next(err); }
};

// @desc    Bulk update order statuses
// @route   PATCH /api/orders/bulk-update
// @access  Private/Admin
export const bulkUpdateOrders = async (req, res, next) => {
  try {
    const { orderIds, status } = req.body;
    const normalizedStatus = normalizeBulkStatus(status);

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      res.status(400);
      throw new Error('orderIds must be a non-empty array');
    }

    if (!normalizedStatus) {
      res.status(400);
      throw new Error('Invalid status. Allowed: pending, delivered, cancelled');
    }

    const updatePayload = {
      status: normalizedStatus,
      orderStatus: STATUS_TO_LEGACY[normalizedStatus],
      ...(normalizedStatus === 'delivered'
        ? { isDelivered: true, deliveredAt: new Date() }
        : normalizedStatus === 'cancelled'
          ? { isDelivered: false, deliveredAt: null }
          : {}),
    };

    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: updatePayload }
    );

    res.json({
      message: `Updated ${result.modifiedCount} order(s)`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      status: normalizedStatus,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.id || item._id,
      })),
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.zip || shippingAddress.postalCode || '00000',
        country: shippingAddress.country || 'United States',
      },
      paymentMethod: 'Stripe',
      totalPrice,
      orderStatus: 'PENDING',
      isPaid: true, // Mock success or updated upon checkout completion
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    next(err);
  }
};

// @desc    Get order by partial ID / tracking ID
// @route   GET /api/orders/track/:trackId
// @access  Public
export const getOrderByTrackId = async (req, res, next) => {
  try {
    const cleanId = req.params.trackId.toUpperCase().replace('SHZ-', '').replace('#', '').trim();
    if (!cleanId) {
      res.status(400);
      throw new Error('Valid Order ID required');
    }

    // Find all orders and search by partial ID in memory (since MongoDB IDs are stringified in query)
    const orders = await Order.find({});
    const matched = orders.find(o => o._id.toString().toUpperCase().includes(cleanId));

    if (matched) {
      res.json(matched);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get orders by phone number
// @route   GET /api/orders/phone/:phone
// @access  Public
export const getOrdersByPhone = async (req, res, next) => {
  try {
    const phone = req.params.phone.trim();
    if (!phone) {
      res.status(400);
      throw new Error('Phone number is required');
    }

    const orders = await Order.find({ 'shippingAddress.phone': phone }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
