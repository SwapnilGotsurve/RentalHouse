import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Verify JWT Token
export const verifyToken = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Token verification failed',
      error: error.message
    });
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// Check if user owns the resource
export const checkOwnership = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const userId = req.user._id;

      let resource;
      
      // Handle different models
      switch (resourceModel) {
        case 'Property':
          const Property = (await import('../models/Property.js')).default;
          resource = await Property.findById(resourceId);
          if (resource && !resource.owner.equals(userId)) {
            return res.status(403).json({
              success: false,
              message: 'Access denied. You do not own this property.'
            });
          }
          break;
          
        case 'Booking':
          const Booking = (await import('../models/Booking.js')).default;
          resource = await Booking.findById(resourceId);
          if (resource && !resource.tenant.equals(userId) && !resource.owner.equals(userId)) {
            return res.status(403).json({
              success: false,
              message: 'Access denied. You are not associated with this booking.'
            });
          }
          break;
          
        case 'Maintenance':
          const Maintenance = (await import('../models/Maintenance.js')).default;
          resource = await Maintenance.findById(resourceId);
          if (resource && !resource.tenant.equals(userId) && !resource.owner.equals(userId)) {
            return res.status(403).json({
              success: false,
              message: 'Access denied. You are not associated with this maintenance request.'
            });
          }
          break;
          
        case 'Payment':
          const Payment = (await import('../models/Payment.js')).default;
          resource = await Payment.findById(resourceId);
          if (resource && !resource.tenant.equals(userId) && !resource.owner.equals(userId)) {
            return res.status(403).json({
              success: false,
              message: 'Access denied. You are not associated with this payment.'
            });
          }
          break;
          
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid resource model'
          });
      }

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking ownership',
        error: error.message
      });
    }
  };
};

// Optional authentication (for public routes that can benefit from user context)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we continue without user context
        console.log('Optional auth failed:', error.message);
      }
    }

    next();
  } catch (error) {
    next();
  }
};

// Rate limiting for authentication attempts
export const authRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip + req.body.email;
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const attempt = attempts.get(key);
    
    if (now > attempt.resetTime) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (attempt.count >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: `Too many authentication attempts. Please try again after ${Math.ceil(windowMs / 60000)} minutes.`
      });
    }

    attempt.count++;
    next();
  };
};

// Admin permission check
export const checkAdminPermission = (permission) => {
  return (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    if (req.user.adminInfo && req.user.adminInfo.permissions) {
      if (!req.user.adminInfo.permissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: `Admin permission required: ${permission}`
        });
      }
    }

    next();
  };
};