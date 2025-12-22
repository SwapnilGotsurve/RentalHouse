import express from 'express';
import User from '../models/User.js';
import { verifyToken, authorize } from '../middleware/auth.js';
import { validateUserUpdate, validateObjectIdParam } from '../middleware/validation.js';
import { uploadSingle } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', authorize('admin'), asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const { role, search, status } = req.query;
  
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
  
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await User.countDocuments(query);
  
  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', validateObjectIdParam('id'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Users can only view their own profile unless they're admin
  if (req.user.role !== 'admin' && !req.user._id.equals(user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
}));

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', validateObjectIdParam('id'), validateUserUpdate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Users can only update their own profile unless they're admin
  if (req.user.role !== 'admin' && !req.user._id.equals(user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  // Define allowed fields based on role
  let allowedFields = ['firstName', 'lastName', 'phone', 'address', 'dateOfBirth', 'occupation'];
  
  if (req.user.role === 'admin') {
    allowedFields.push('role', 'isActive', 'isVerified');
  }
  
  // Filter allowed fields
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });
  
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');
  
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: updatedUser
    }
  });
}));

// @desc    Upload profile image
// @route   POST /api/users/:id/profile-image
// @access  Private
router.post('/:id/profile-image', 
  validateObjectIdParam('id'),
  uploadSingle('profileImage'),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Users can only update their own profile image unless they're admin
    if (req.user.role !== 'admin' && !req.user._id.equals(user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    // Update user profile image
    user.profileImage = req.file.url;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      data: {
        profileImage: req.file.url
      }
    });
  })
);

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', 
  authorize('admin'),
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent admin from deleting themselves
    if (req.user._id.equals(user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }
    
    // Soft delete - deactivate instead of removing
    user.isActive = false;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  })
);

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats
// @access  Private/Admin
router.get('/stats/overview', authorize('admin'), asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const verifiedUsers = await User.countDocuments({ isVerified: true });
  
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const recentUsers = await User.find()
    .select('firstName lastName email role createdAt')
    .sort({ createdAt: -1 })
    .limit(5);
  
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
  
  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        inactiveUsers: totalUsers - activeUsers
      },
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentUsers,
      userGrowth
    }
  });
}));

// @desc    Update user role-specific information
// @route   PUT /api/users/:id/role-info
// @access  Private
router.put('/:id/role-info',
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Users can only update their own role info unless they're admin
    if (req.user.role !== 'admin' && !req.user._id.equals(user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const { role } = user;
    const updates = {};
    
    // Update role-specific information
    if (role === 'tenant' && req.body.tenantInfo) {
      updates.tenantInfo = { ...user.tenantInfo, ...req.body.tenantInfo };
    } else if (role === 'owner' && req.body.ownerInfo) {
      updates.ownerInfo = { ...user.ownerInfo, ...req.body.ownerInfo };
    } else if (role === 'admin' && req.body.adminInfo && req.user.role === 'admin') {
      updates.adminInfo = { ...user.adminInfo, ...req.body.adminInfo };
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Role information updated successfully',
      data: {
        user: updatedUser
      }
    });
  })
);

// @desc    Get user notifications
// @route   GET /api/users/me/notifications
// @access  Private
router.get('/me/notifications', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('notifications');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Sort notifications by createdAt (newest first)
  const notifications = (user.notifications || []).sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  res.status(200).json({
    success: true,
    data: {
      notifications,
      unreadCount
    }
  });
}));

// @desc    Mark notification as read
// @route   PATCH /api/users/me/notifications/:notificationId
// @access  Private
router.patch('/me/notifications/:notificationId', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const notification = user.notifications.id(req.params.notificationId);
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }
  
  notification.read = true;
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: {
      notification
    }
  });
}));

// @desc    Mark all notifications as read
// @route   PATCH /api/users/me/notifications
// @access  Private
router.patch('/me/notifications', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  user.notifications.forEach(notification => {
    notification.read = true;
  });
  
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
}));

export default router;