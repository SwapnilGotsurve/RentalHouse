import express from 'express';
import Maintenance from '../models/Maintenance.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import { verifyToken, authorize, checkOwnership } from '../middleware/auth.js';
import { validateMaintenanceRequest, validateObjectIdParam } from '../middleware/validation.js';
import { uploadMultiple } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// @desc    Create maintenance request
// @route   POST /api/maintenance
// @access  Private/Tenant
router.post('/',
  authorize('tenant', 'admin'),
  uploadMultiple('images', 5),
  validateMaintenanceRequest,
  asyncHandler(async (req, res) => {
    const { property: propertyId, title, description, category, priority, location } = req.body;
    
    // Verify property exists
    const property = await Property.findById(propertyId).populate('owner');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Verify tenant has active booking for this property (unless admin)
    if (req.user.role !== 'admin') {
      const activeBooking = await Booking.findOne({
        property: propertyId,
        tenant: req.user._id,
        status: 'active'
      });
      
      if (!activeBooking) {
        return res.status(403).json({
          success: false,
          message: 'You must have an active booking for this property to request maintenance'
        });
      }
    }
    
    // Prepare maintenance data
    const maintenanceData = {
      title,
      description,
      category,
      priority: priority || 'medium',
      property: propertyId,
      tenant: req.user._id,
      owner: property.owner._id,
      location: location || {}
    };
    
    // Add uploaded images
    if (req.files && req.files.length > 0) {
      maintenanceData.images = req.files.map(file => ({
        url: file.url,
        caption: ''
      }));
    }
    
    const maintenance = await Maintenance.create(maintenanceData);
    
    await maintenance.populate([
      { path: 'property', select: 'title location' },
      { path: 'tenant', select: 'firstName lastName email phone' },
      { path: 'owner', select: 'firstName lastName email phone' }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      data: {
        maintenance
      }
    });
  })
);

// @desc    Get all maintenance requests (with filters)
// @route   GET /api/maintenance
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const { status, priority, category, property } = req.query;
  
  // Build query based on user role
  let query = {};
  
  if (req.user.role === 'tenant') {
    query.tenant = req.user._id;
  } else if (req.user.role === 'owner') {
    query.owner = req.user._id;
  }
  // Admin can see all maintenance requests
  
  if (status) {
    query.status = status;
  }
  
  if (priority) {
    query.priority = priority;
  }
  
  if (category) {
    query.category = category;
  }
  
  if (property) {
    query.property = property;
  }
  
  const maintenance = await Maintenance.find(query)
    .populate('property', 'title location')
    .populate('tenant', 'firstName lastName email phone profileImage')
    .populate('owner', 'firstName lastName email phone profileImage')
    .populate('assignedTo', 'firstName lastName email phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Maintenance.countDocuments(query);
  
  res.status(200).json({
    success: true,
    data: {
      maintenance,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get single maintenance request
// @route   GET /api/maintenance/:id
// @access  Private
router.get('/:id',
  validateObjectIdParam('id'),
  checkOwnership('Maintenance'),
  asyncHandler(async (req, res) => {
    const maintenance = req.resource;
    
    await maintenance.populate([
      { path: 'property', populate: { path: 'owner', select: 'firstName lastName email phone' } },
      { path: 'tenant', select: 'firstName lastName email phone profileImage address' },
      { path: 'owner', select: 'firstName lastName email phone profileImage' },
      { path: 'assignedTo', select: 'firstName lastName email phone profileImage' },
      { path: 'updates.updatedBy', select: 'firstName lastName profileImage' }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        maintenance
      }
    });
  })
);

// @desc    Update maintenance status
// @route   PATCH /api/maintenance/:id/status
// @access  Private/Owner/Admin
router.patch('/:id/status',
  validateObjectIdParam('id'),
  checkOwnership('Maintenance'),
  asyncHandler(async (req, res) => {
    const maintenance = req.resource;
    const { status, message, scheduledDate, estimatedCompletionDate } = req.body;
    
    // Only owner, assigned technician, or admin can update status
    const canUpdate = req.user._id.equals(maintenance.owner) ||
                     req.user.role === 'admin' ||
                     (maintenance.assignedTo && req.user._id.equals(maintenance.assignedTo));
    
    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this maintenance request'
      });
    }
    
    const validStatuses = ['pending', 'acknowledged', 'in-progress', 'completed', 'cancelled', 'on-hold'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    // Update scheduled date if provided
    if (scheduledDate) {
      maintenance.timeline.scheduledDate = new Date(scheduledDate);
    }
    
    // Update estimated completion date if provided
    if (estimatedCompletionDate) {
      maintenance.timeline.estimatedCompletionDate = new Date(estimatedCompletionDate);
    }
    
    // Add update with message
    await maintenance.addUpdate(req.user._id, message || `Status changed to ${status}`, status);
    
    res.status(200).json({
      success: true,
      message: 'Maintenance status updated successfully',
      data: {
        maintenance: {
          _id: maintenance._id,
          status: maintenance.status,
          timeline: maintenance.timeline
        }
      }
    });
  })
);

// @desc    Assign maintenance to technician
// @route   PATCH /api/maintenance/:id/assign
// @access  Private/Owner/Admin
router.patch('/:id/assign',
  validateObjectIdParam('id'),
  checkOwnership('Maintenance'),
  asyncHandler(async (req, res) => {
    const maintenance = req.resource;
    const { assignedTo, message } = req.body;
    
    // Only owner or admin can assign maintenance
    if (!req.user._id.equals(maintenance.owner) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only property owner or admin can assign maintenance'
      });
    }
    
    if (assignedTo) {
      maintenance.assignedTo = assignedTo;
      
      // If not already acknowledged, change status to acknowledged
      if (maintenance.status === 'pending') {
        maintenance.status = 'acknowledged';
      }
    } else {
      maintenance.assignedTo = undefined;
    }
    
    // Add update message
    const updateMessage = assignedTo 
      ? (message || 'Maintenance assigned to technician')
      : 'Maintenance assignment removed';
    
    await maintenance.addUpdate(req.user._id, updateMessage);
    
    res.status(200).json({
      success: true,
      message: assignedTo ? 'Maintenance assigned successfully' : 'Assignment removed successfully',
      data: {
        maintenance: {
          _id: maintenance._id,
          assignedTo: maintenance.assignedTo,
          status: maintenance.status
        }
      }
    });
  })
);

// @desc    Add update to maintenance request
// @route   POST /api/maintenance/:id/updates
// @access  Private
router.post('/:id/updates',
  validateObjectIdParam('id'),
  checkOwnership('Maintenance'),
  uploadMultiple('images', 3),
  asyncHandler(async (req, res) => {
    const maintenance = req.resource;
    const { message, status } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Update message is required'
      });
    }
    
    // Prepare images array
    const images = req.files ? req.files.map(file => file.url) : [];
    
    // Add update
    await maintenance.addUpdate(req.user._id, message.trim(), status, images);
    
    await maintenance.populate('updates.updatedBy', 'firstName lastName profileImage');
    
    res.status(201).json({
      success: true,
      message: 'Update added successfully',
      data: {
        update: maintenance.updates[maintenance.updates.length - 1]
      }
    });
  })
);

// @desc    Update cost estimate
// @route   PUT /api/maintenance/:id/cost-estimate
// @access  Private/Owner/Admin
router.put('/:id/cost-estimate',
  validateObjectIdParam('id'),
  checkOwnership('Maintenance'),
  asyncHandler(async (req, res) => {
    const maintenance = req.resource;
    const { amount, breakdown } = req.body;
    
    // Only owner, assigned technician, or admin can update cost
    const canUpdate = req.user._id.equals(maintenance.owner) ||
                     req.user.role === 'admin' ||
                     (maintenance.assignedTo && req.user._id.equals(maintenance.assignedTo));
    
    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update cost estimate'
      });
    }
    
    if (amount !== undefined) {
      maintenance.costEstimate.amount = amount;
    }
    
    if (breakdown && Array.isArray(breakdown)) {
      maintenance.costEstimate.breakdown = breakdown;
    }
    
    await maintenance.save();
    
    // Add update message
    await maintenance.addUpdate(
      req.user._id, 
      `Cost estimate updated: ₹${amount || maintenance.costEstimate.amount}`
    );
    
    res.status(200).json({
      success: true,
      message: 'Cost estimate updated successfully',
      data: {
        costEstimate: maintenance.costEstimate
      }
    });
  })
);

// @desc    Update actual cost
// @route   PUT /api/maintenance/:id/actual-cost
// @access  Private/Owner/Admin
router.put('/:id/actual-cost',
  validateObjectIdParam('id'),
  checkOwnership('Maintenance'),
  uploadMultiple('receipt', 1),
  asyncHandler(async (req, res) => {
    const maintenance = req.resource;
    const { amount } = req.body;
    
    // Only owner, assigned technician, or admin can update actual cost
    const canUpdate = req.user._id.equals(maintenance.owner) ||
                     req.user.role === 'admin' ||
                     (maintenance.assignedTo && req.user._id.equals(maintenance.assignedTo));
    
    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update actual cost'
      });
    }
    
    if (amount !== undefined) {
      maintenance.actualCost.amount = amount;
    }
    
    // Add receipt if uploaded
    if (req.files && req.files.length > 0) {
      maintenance.actualCost.receipt = req.files[0].url;
    }
    
    await maintenance.save();
    
    // Add update message
    await maintenance.addUpdate(
      req.user._id, 
      `Actual cost updated: ₹${amount || maintenance.actualCost.amount}`
    );
    
    res.status(200).json({
      success: true,
      message: 'Actual cost updated successfully',
      data: {
        actualCost: maintenance.actualCost
      }
    });
  })
);

// @desc    Submit tenant feedback
// @route   POST /api/maintenance/:id/feedback
// @access  Private/Tenant
router.post('/:id/feedback',
  validateObjectIdParam('id'),
  checkOwnership('Maintenance'),
  asyncHandler(async (req, res) => {
    const maintenance = req.resource;
    const { rating, comment } = req.body;
    
    // Only tenant can submit feedback
    if (!req.user._id.equals(maintenance.tenant)) {
      return res.status(403).json({
        success: false,
        message: 'Only the tenant can submit feedback'
      });
    }
    
    // Can only submit feedback for completed maintenance
    if (maintenance.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for completed maintenance'
      });
    }
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    maintenance.feedback = {
      rating,
      comment: comment || '',
      submittedAt: new Date()
    };
    
    await maintenance.save();
    
    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        feedback: maintenance.feedback
      }
    });
  })
);

// @desc    Get maintenance statistics
// @route   GET /api/maintenance/stats/overview
// @access  Private
router.get('/stats/overview', asyncHandler(async (req, res) => {
  let query = {};
  
  // Filter by user role
  if (req.user.role === 'tenant') {
    query.tenant = req.user._id;
  } else if (req.user.role === 'owner') {
    query.owner = req.user._id;
  }
  // Admin can see all stats
  
  const totalRequests = await Maintenance.countDocuments(query);
  const pendingRequests = await Maintenance.countDocuments({ ...query, status: 'pending' });
  const inProgressRequests = await Maintenance.countDocuments({ 
    ...query, 
    status: { $in: ['acknowledged', 'in-progress'] } 
  });
  const completedRequests = await Maintenance.countDocuments({ ...query, status: 'completed' });
  const emergencyRequests = await Maintenance.countDocuments({ ...query, isEmergency: true });
  
  // Requests by category
  const requestsByCategory = await Maintenance.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
  
  // Requests by priority
  const requestsByPriority = await Maintenance.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Average response time (for completed requests)
  const responseTimeStats = await Maintenance.aggregate([
    {
      $match: {
        ...query,
        status: 'completed',
        'timeline.acknowledgedDate': { $exists: true }
      }
    },
    {
      $project: {
        responseTime: {
          $divide: [
            { $subtract: ['$timeline.acknowledgedDate', '$timeline.requestedDate'] },
            1000 * 60 * 60 // Convert to hours
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        avgResponseTime: { $avg: '$responseTime' },
        minResponseTime: { $min: '$responseTime' },
        maxResponseTime: { $max: '$responseTime' }
      }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalRequests,
        pendingRequests,
        inProgressRequests,
        completedRequests,
        emergencyRequests
      },
      requestsByCategory: requestsByCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      requestsByPriority: requestsByPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      responseTimeStats: responseTimeStats[0] || {
        avgResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0
      }
    }
  });
}));

// @desc    Get emergency maintenance requests
// @route   GET /api/maintenance/emergency
// @access  Private/Owner/Admin
router.get('/emergency',
  authorize('owner', 'admin'),
  asyncHandler(async (req, res) => {
    let query = { isEmergency: true, status: { $ne: 'completed' } };
    
    // Filter by user role
    if (req.user.role === 'owner') {
      query.owner = req.user._id;
    }
    
    const emergencyRequests = await Maintenance.find(query)
      .populate('property', 'title location')
      .populate('tenant', 'firstName lastName email phone')
      .sort({ 'timeline.requestedDate': 1 }); // Oldest first
    
    res.status(200).json({
      success: true,
      data: {
        emergencyRequests
      }
    });
  })
);

// @desc    Get overdue maintenance requests
// @route   GET /api/maintenance/overdue
// @access  Private/Owner/Admin
router.get('/overdue',
  authorize('owner', 'admin'),
  asyncHandler(async (req, res) => {
    const days = parseInt(req.query.days) || 7;
    
    let overdueRequests = await Maintenance.findOverdue(days);
    
    // Filter by user role
    if (req.user.role === 'owner') {
      overdueRequests = overdueRequests.filter(request => 
        request.owner.equals(req.user._id)
      );
    }
    
    await Maintenance.populate(overdueRequests, [
      { path: 'property', select: 'title location' },
      { path: 'tenant', select: 'firstName lastName email phone' }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        overdueRequests
      }
    });
  })
);

export default router;