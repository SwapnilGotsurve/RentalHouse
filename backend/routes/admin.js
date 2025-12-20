import express from 'express';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Maintenance from '../models/Maintenance.js';
import Payment from '../models/Payment.js';
import Review from '../models/Review.js';
import { verifyToken, authorize, checkAdminPermission } from '../middleware/auth.js';
import { validateObjectIdParam } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes require admin authentication
router.use(verifyToken, authorize('admin'));

// @desc    Get dashboard overview
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', asyncHandler(async (req, res) => {
  // Get current date ranges
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
  // User statistics
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: startOfMonth }
  });
  const newUsersLastMonth = await User.countDocuments({
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
  });
  
  // Property statistics
  const totalProperties = await Property.countDocuments();
  const activeProperties = await Property.countDocuments({ isActive: true });
  const availableProperties = await Property.countDocuments({
    isActive: true,
    'availability.status': 'available'
  });
  
  // Booking statistics
  const totalBookings = await Booking.countDocuments();
  const activeBookings = await Booking.countDocuments({ status: 'active' });
  const pendingBookings = await Booking.countDocuments({ status: 'pending' });
  
  // Revenue statistics
  const monthlyRevenue = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paidDate: { $gte: startOfMonth }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);
  
  const lastMonthRevenue = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paidDate: { $gte: startOfLastMonth, $lte: endOfLastMonth }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);
  
  // Maintenance statistics
  const pendingMaintenance = await Maintenance.countDocuments({
    status: { $in: ['pending', 'acknowledged'] }
  });
  const emergencyMaintenance = await Maintenance.countDocuments({
    isEmergency: true,
    status: { $ne: 'completed' }
  });
  
  // User growth over last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
  
  // Revenue trend over last 6 months
  const revenueTrend = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paidDate: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$paidDate' },
          month: { $month: '$paidDate' }
        },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
  
  // Recent activities
  const recentUsers = await User.find()
    .select('firstName lastName email role createdAt')
    .sort({ createdAt: -1 })
    .limit(5);
  
  const recentProperties = await Property.find()
    .select('title location.city rent.amount createdAt')
    .populate('owner', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(5);
  
  const recentBookings = await Booking.find()
    .select('status financialTerms.monthlyRent createdAt')
    .populate('property', 'title')
    .populate('tenant', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(5);
  
  // Calculate growth percentages
  const userGrowthPercentage = newUsersLastMonth > 0 
    ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth * 100).toFixed(1)
    : 0;
  
  const revenueGrowthPercentage = lastMonthRevenue[0]?.total > 0
    ? (((monthlyRevenue[0]?.total || 0) - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100).toFixed(1)
    : 0;
  
  res.status(200).json({
    success: true,
    data: {
      overview: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth: newUsersThisMonth,
          growthPercentage: parseFloat(userGrowthPercentage)
        },
        properties: {
          total: totalProperties,
          active: activeProperties,
          available: availableProperties,
          occupied: activeProperties - availableProperties
        },
        bookings: {
          total: totalBookings,
          active: activeBookings,
          pending: pendingBookings
        },
        revenue: {
          thisMonth: monthlyRevenue[0]?.total || 0,
          lastMonth: lastMonthRevenue[0]?.total || 0,
          growthPercentage: parseFloat(revenueGrowthPercentage)
        },
        maintenance: {
          pending: pendingMaintenance,
          emergency: emergencyMaintenance
        }
      },
      charts: {
        userGrowth,
        revenueTrend
      },
      recentActivity: {
        users: recentUsers,
        properties: recentProperties,
        bookings: recentBookings
      }
    }
  });
}));

// @desc    Get user management data
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', checkAdminPermission('users'), asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  const { role, status, search, sortBy } = req.query;
  
  // Build query
  const query = {};
  
  if (role) {
    query.role = role;
  }
  
  if (status) {
    query.isActive = status === 'active';
  }
  
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Build sort
  let sort = { createdAt: -1 };
  switch (sortBy) {
    case 'name':
      sort = { firstName: 1, lastName: 1 };
      break;
    case 'email':
      sort = { email: 1 };
      break;
    case 'role':
      sort = { role: 1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'oldest':
      sort = { createdAt: 1 };
      break;
  }
  
  const users = await User.find(query)
    .select('-password')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await User.countDocuments(query);
  
  // Get user statistics
  const userStats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        active: { $sum: { $cond: ['$isActive', 1, 0] } },
        verified: { $sum: { $cond: ['$isVerified', 1, 0] } }
      }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      statistics: userStats.reduce((acc, stat) => {
        acc[stat._id] = {
          total: stat.count,
          active: stat.active,
          verified: stat.verified
        };
        return acc;
      }, {})
    }
  });
}));

// @desc    Get property management data
// @route   GET /api/admin/properties
// @access  Private/Admin
router.get('/properties', checkAdminPermission('properties'), asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  const { status, propertyType, city, sortBy } = req.query;
  
  // Build query
  const query = {};
  
  if (status) {
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    } else if (status === 'available') {
      query.isActive = true;
      query['availability.status'] = 'available';
    } else if (status === 'occupied') {
      query.isActive = true;
      query['availability.status'] = 'occupied';
    }
  }
  
  if (propertyType) {
    query.propertyType = propertyType;
  }
  
  if (city) {
    query['location.city'] = { $regex: city, $options: 'i' };
  }
  
  // Build sort
  let sort = { createdAt: -1 };
  switch (sortBy) {
    case 'title':
      sort = { title: 1 };
      break;
    case 'rent':
      sort = { 'rent.amount': -1 };
      break;
    case 'location':
      sort = { 'location.city': 1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'oldest':
      sort = { createdAt: 1 };
      break;
  }
  
  const properties = await Property.find(query)
    .populate('owner', 'firstName lastName email')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await Property.countDocuments(query);
  
  // Get property statistics
  const propertyStats = await Property.aggregate([
    {
      $group: {
        _id: '$propertyType',
        count: { $sum: 1 },
        active: { $sum: { $cond: ['$isActive', 1, 0] } },
        averageRent: { $avg: '$rent.amount' }
      }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      statistics: propertyStats.reduce((acc, stat) => {
        acc[stat._id] = {
          total: stat.count,
          active: stat.active,
          averageRent: Math.round(stat.averageRent)
        };
        return acc;
      }, {})
    }
  });
}));

// @desc    Get revenue analytics
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
router.get('/analytics/revenue', checkAdminPermission('analytics'), asyncHandler(async (req, res) => {
  const { period = '6months' } = req.query;
  
  let startDate;
  const now = new Date();
  
  switch (period) {
    case '1month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case '3months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      break;
    case '6months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      break;
    case '1year':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  }
  
  // Revenue over time
  const revenueOverTime = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paidDate: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$paidDate' },
          month: { $month: '$paidDate' }
        },
        revenue: { $sum: '$amount' },
        transactions: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
  
  // Revenue by payment type
  const revenueByType = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paidDate: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$paymentType',
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { revenue: -1 }
    }
  ]);
  
  // Top performing properties
  const topProperties = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paidDate: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$property',
        revenue: { $sum: '$amount' },
        transactions: { $sum: 1 }
      }
    },
    {
      $sort: { revenue: -1 }
    },
    {
      $limit: 10
    },
    {
      $lookup: {
        from: 'properties',
        localField: '_id',
        foreignField: '_id',
        as: 'property'
      }
    },
    {
      $unwind: '$property'
    },
    {
      $project: {
        revenue: 1,
        transactions: 1,
        title: '$property.title',
        location: '$property.location.city'
      }
    }
  ]);
  
  // Payment statistics
  const paymentStats = await Payment.aggregate([
    {
      $match: {
        paidDate: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        amount: { $sum: '$amount' }
      }
    }
  ]);
  
  // Total revenue and growth
  const totalRevenue = revenueOverTime.reduce((sum, item) => sum + item.revenue, 0);
  const totalTransactions = revenueOverTime.reduce((sum, item) => sum + item.transactions, 0);
  
  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalRevenue,
        totalTransactions,
        averageTransactionValue: totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0
      },
      charts: {
        revenueOverTime,
        revenueByType
      },
      topProperties,
      paymentStatistics: paymentStats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          amount: stat.amount
        };
        return acc;
      }, {})
    }
  });
}));

// @desc    Get system monitoring data
// @route   GET /api/admin/system
// @access  Private/Admin
router.get('/system', checkAdminPermission('system'), asyncHandler(async (req, res) => {
  // Database statistics
  const dbStats = {
    users: await User.countDocuments(),
    properties: await Property.countDocuments(),
    bookings: await Booking.countDocuments(),
    payments: await Payment.countDocuments(),
    maintenance: await Maintenance.countDocuments(),
    reviews: await Review.countDocuments()
  };
  
  // System health indicators
  const healthChecks = {
    database: 'healthy', // This would be determined by actual health checks
    server: 'healthy',
    storage: 'healthy',
    apiResponseTime: Math.random() * 100 + 50 // Mock response time
  };
  
  // Recent system activities
  const recentActivities = [
    {
      type: 'user_registration',
      message: 'New user registered',
      timestamp: new Date(),
      severity: 'info'
    },
    {
      type: 'property_created',
      message: 'New property listed',
      timestamp: new Date(Date.now() - 300000),
      severity: 'info'
    },
    {
      type: 'payment_completed',
      message: 'Payment processed successfully',
      timestamp: new Date(Date.now() - 600000),
      severity: 'success'
    }
  ];
  
  // Error logs (mock data)
  const errorLogs = [
    {
      message: 'Failed to send email notification',
      timestamp: new Date(Date.now() - 3600000),
      severity: 'warning',
      details: 'SMTP connection timeout'
    }
  ];
  
  res.status(200).json({
    success: true,
    data: {
      databaseStats: dbStats,
      healthChecks,
      recentActivities,
      errorLogs,
      serverInfo: {
        uptime: process.uptime(),
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage()
      }
    }
  });
}));

// @desc    Update user status (Admin only)
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
router.patch('/users/:id/status',
  checkAdminPermission('users'),
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const { isActive, isVerified } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent admin from deactivating themselves
    if (req.user._id.equals(user._id) && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }
    
    if (isActive !== undefined) {
      user.isActive = isActive;
    }
    
    if (isVerified !== undefined) {
      user.isVerified = isVerified;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: {
        user: {
          _id: user._id,
          isActive: user.isActive,
          isVerified: user.isVerified
        }
      }
    });
  })
);

// @desc    Update property status (Admin only)
// @route   PATCH /api/admin/properties/:id/status
// @access  Private/Admin
router.patch('/properties/:id/status',
  checkAdminPermission('properties'),
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const { isActive, isVerified } = req.body;
    
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    if (isActive !== undefined) {
      property.isActive = isActive;
    }
    
    if (isVerified !== undefined) {
      property.isVerified = isVerified;
      if (isVerified) {
        property.verificationDate = new Date();
      }
    }
    
    await property.save();
    
    res.status(200).json({
      success: true,
      message: 'Property status updated successfully',
      data: {
        property: {
          _id: property._id,
          isActive: property.isActive,
          isVerified: property.isVerified,
          verificationDate: property.verificationDate
        }
      }
    });
  })
);

export default router;