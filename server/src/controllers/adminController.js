import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Total Revenue Aggregation
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    
    // Determine how many products exactly were sold
    const itemsData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      { $group: { _id: null, totalProductsSold: { $sum: '$orderItems.qty' } } }
    ]);
    const totalProductsSold = itemsData.length > 0 ? itemsData[0].totalProductsSold : 0;

    // Daily Sales Graph Data (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailySales = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, isPaid: true } },
      { 
        $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Product Performance (Top 5 selling products)
    const topProducts = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      { 
        $group: { 
          _id: '$orderItems.name', 
          qty: { $sum: '$orderItems.qty' },
          revenue: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } }
        }
      },
      { $sort: { qty: -1 } },
      { $limit: 5 }
    ]);

    // Top Purchasers Data
    const topUsers = await Order.aggregate([
      { $match: { isPaid: true } },
      { 
        $group: { 
          _id: '$user', 
          totalSpent: { $sum: '$totalPrice' },
          ordersCount: { $sum: 1 }
        }
      },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 1, name: '$user.name', email: '$user.email', totalSpent: 1, ordersCount: 1 } },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      summary: { totalUsers, totalOrders, totalRevenue, totalProductsSold },
      dailySales,
      topProducts,
      topUsers
    });
  } catch (error) { next(error); }
};

// @desc    Get All Users (Admin Only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) { next(error); }
};



// @desc    Get All Orders (Admin Only)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { next(error); }
};

// @desc    Update Order Status (Admin Only)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    order.orderStatus = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) { next(error); }
};
