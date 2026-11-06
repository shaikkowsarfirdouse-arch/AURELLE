import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Get dashboard metrics & analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 3 } });

    // Aggregate total revenue and paid orders
    const salesAggregation = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          avgOrderValue: { $avg: '$totalPrice' },
        },
      },
    ]);

    const totalRevenue = salesAggregation[0]?.totalRevenue || 0;
    const avgOrderValue = Math.round((salesAggregation[0]?.avgOrderValue || 0) * 100) / 100;

    // Order status breakdown
    const statusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Sales by Category
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$categoryName',
          productCount: { $sum: 1 },
          avgPrice: { $avg: '$price' },
        },
      },
      { $sort: { productCount: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        avgOrderValue,
        totalOrders,
        totalProducts,
        totalCustomers,
        lowStockCount,
        statusBreakdown,
        categoryStats,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Attach order count for each user
    const usersWithOrderCount = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          orderCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithOrderCount.length,
      users: usersWithOrderCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

