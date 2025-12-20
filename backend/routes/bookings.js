import express from 'express';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import { verifyToken, authorize, checkOwnership } from '../middleware/auth.js';
import { validateBookingCreation, validateObjectIdParam } from '../middleware/validation.js';
import { uploadMultiple } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// @desc    Create booking request
// @route   POST /api/bookings
// @access  Private/Tenant
router.post('/', 
  authorize('tenant', 'admin'),
  uploadMultiple('documents', 5),
  validateBookingCreation,
  asyncHandler(async (req, res) => {
    const { property: propertyId, leaseDetails, financialTerms, terms, emergencyContacts } = req.body;
    
    // Check if property exists and is available
    const property = await Property.findById(propertyId).populate('owner');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    if (!property.isActive || property.availability.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for booking'
      });
    }
    
    // Check if user already has a pending/active booking for this property
    const existingBooking = await Booking.findOne({
      property: propertyId,
      tenant: req.user._id,
      status: { $in: ['pending', 'approved', 'active'] }
    });
    
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking request for this property'
      });
    }
    
    // Calculate lease duration in months
    const startDate = new Date(leaseDetails.startDate);
    const endDate = new Date(leaseDetails.endDate);
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
    
    // Prepare booking data
    const bookingData = {
      property: propertyId,
      tenant: req.user._id,
      owner: property.owner._id,
      leaseDetails: {
        ...leaseDetails,
        duration
      },
      financialTerms: {
        ...financialTerms,
        currency: 'INR'
      },
      terms,
      emergencyContacts: emergencyContacts || []
    };
    
    // Add uploaded documents
    if (req.files && req.files.length > 0) {
      bookingData.documents = req.files.map(file => ({
        type: 'other', // This should be determined based on file or user input
        url: file.url,
        uploadedBy: req.user._id
      }));
    }
    
    const booking = await Booking.create(bookingData);
    
    await booking.populate([
      { path: 'property', select: 'title location rent' },
      { path: 'tenant', select: 'firstName lastName email phone' },
      { path: 'owner', select: 'firstName lastName email phone' }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      data: {
        booking
      }
    });
  })
);

// @desc    Get all bookings (with filters)
// @route   GET /api/bookings
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const { status, role } = req.query;
  
  // Build query based on user role
  let query = {};
  
  if (req.user.role === 'tenant') {
    query.tenant = req.user._id;
  } else if (req.user.role === 'owner') {
    query.owner = req.user._id;
  }
  // Admin can see all bookings
  
  if (status) {
    query.status = status;
  }
  
  const bookings = await Booking.find(query)
    .populate('property', 'title location rent images')
    .populate('tenant', 'firstName lastName email phone profileImage')
    .populate('owner', 'firstName lastName email phone profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Booking.countDocuments(query);
  
  res.status(200).json({
    success: true,
    data: {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', 
  validateObjectIdParam('id'),
  checkOwnership('Booking'),
  asyncHandler(async (req, res) => {
    const booking = req.resource;
    
    await booking.populate([
      { path: 'property', populate: { path: 'owner', select: 'firstName lastName email phone' } },
      { path: 'tenant', select: 'firstName lastName email phone profileImage address' },
      { path: 'owner', select: 'firstName lastName email phone profileImage' }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        booking
      }
    });
  })
);

// @desc    Update booking status (Owner/Admin only)
// @route   PATCH /api/bookings/:id/status
// @access  Private/Owner/Admin
router.patch('/:id/status',
  validateObjectIdParam('id'),
  checkOwnership('Booking'),
  asyncHandler(async (req, res) => {
    const booking = req.resource;
    const { status, notes } = req.body;
    
    // Only owner or admin can update status
    if (!req.user._id.equals(booking.owner) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only property owner or admin can update booking status'
      });
    }
    
    const validStatuses = ['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    // Status transition validation
    const currentStatus = booking.status;
    const validTransitions = {
      pending: ['approved', 'rejected'],
      approved: ['active', 'cancelled'],
      rejected: [],
      active: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };
    
    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${currentStatus} to ${status}`
      });
    }
    
    booking.status = status;
    
    // Update important dates based on status
    const now = new Date();
    switch (status) {
      case 'approved':
        booking.importantDates.approvalDate = now;
        break;
      case 'active':
        booking.importantDates.moveInDate = now;
        // Update property availability
        await Property.findByIdAndUpdate(booking.property, {
          'availability.status': 'occupied'
        });
        break;
      case 'completed':
        booking.importantDates.moveOutDate = now;
        // Update property availability
        await Property.findByIdAndUpdate(booking.property, {
          'availability.status': 'available'
        });
        break;
      case 'cancelled':
        // Update property availability if it was active
        if (currentStatus === 'active') {
          await Property.findByIdAndUpdate(booking.property, {
            'availability.status': 'available'
          });
        }
        break;
    }
    
    // Add notes
    if (notes) {
      if (req.user._id.equals(booking.owner)) {
        booking.notes.ownerNotes = notes;
      } else if (req.user.role === 'admin') {
        booking.notes.adminNotes = notes;
      }
    }
    
    await booking.save();
    
    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        booking: {
          _id: booking._id,
          status: booking.status,
          importantDates: booking.importantDates
        }
      }
    });
  })
);

// @desc    Add message to booking
// @route   POST /api/bookings/:id/messages
// @access  Private
router.post('/:id/messages',
  validateObjectIdParam('id'),
  checkOwnership('Booking'),
  asyncHandler(async (req, res) => {
    const booking = req.resource;
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }
    
    booking.messages.push({
      sender: req.user._id,
      message: message.trim(),
      timestamp: new Date()
    });
    
    await booking.save();
    
    await booking.populate('messages.sender', 'firstName lastName profileImage');
    
    res.status(201).json({
      success: true,
      message: 'Message added successfully',
      data: {
        message: booking.messages[booking.messages.length - 1]
      }
    });
  })
);

// @desc    Upload booking documents
// @route   POST /api/bookings/:id/documents
// @access  Private
router.post('/:id/documents',
  validateObjectIdParam('id'),
  checkOwnership('Booking'),
  uploadMultiple('documents', 5),
  asyncHandler(async (req, res) => {
    const booking = req.resource;
    const { documentTypes } = req.body; // Array of document types corresponding to files
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No documents provided'
      });
    }
    
    const newDocuments = req.files.map((file, index) => ({
      type: documentTypes && documentTypes[index] ? documentTypes[index] : 'other',
      url: file.url,
      uploadedBy: req.user._id
    }));
    
    booking.documents.push(...newDocuments);
    await booking.save();
    
    res.status(201).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: {
        documents: newDocuments
      }
    });
  })
);

// @desc    Update lease terms
// @route   PUT /api/bookings/:id/lease
// @access  Private
router.put('/:id/lease',
  validateObjectIdParam('id'),
  checkOwnership('Booking'),
  asyncHandler(async (req, res) => {
    const booking = req.resource;
    
    // Only allow updates if booking is pending or approved
    if (!['pending', 'approved'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update lease terms for this booking status'
      });
    }
    
    const { leaseDetails, financialTerms, terms } = req.body;
    
    if (leaseDetails) {
      // Recalculate duration if dates changed
      if (leaseDetails.startDate && leaseDetails.endDate) {
        const startDate = new Date(leaseDetails.startDate);
        const endDate = new Date(leaseDetails.endDate);
        leaseDetails.duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
      }
      
      booking.leaseDetails = { ...booking.leaseDetails, ...leaseDetails };
    }
    
    if (financialTerms) {
      booking.financialTerms = { ...booking.financialTerms, ...financialTerms };
    }
    
    if (terms) {
      booking.terms = { ...booking.terms, ...terms };
    }
    
    await booking.save();
    
    res.status(200).json({
      success: true,
      message: 'Lease terms updated successfully',
      data: {
        booking
      }
    });
  })
);

// @desc    Extend lease
// @route   POST /api/bookings/:id/extend
// @access  Private/Owner/Admin
router.post('/:id/extend',
  validateObjectIdParam('id'),
  checkOwnership('Booking'),
  asyncHandler(async (req, res) => {
    const booking = req.resource;
    const { additionalMonths, newMonthlyRent } = req.body;
    
    // Only owner or admin can extend lease
    if (!req.user._id.equals(booking.owner) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only property owner or admin can extend lease'
      });
    }
    
    // Only active bookings can be extended
    if (booking.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Only active bookings can be extended'
      });
    }
    
    if (!additionalMonths || additionalMonths < 1) {
      return res.status(400).json({
        success: false,
        message: 'Additional months must be at least 1'
      });
    }
    
    // Extend the lease
    await booking.extendLease(additionalMonths);
    
    // Update monthly rent if provided
    if (newMonthlyRent && newMonthlyRent > 0) {
      booking.financialTerms.monthlyRent = newMonthlyRent;
    }
    
    await booking.save();
    
    res.status(200).json({
      success: true,
      message: 'Lease extended successfully',
      data: {
        booking: {
          _id: booking._id,
          leaseDetails: booking.leaseDetails,
          financialTerms: booking.financialTerms
        }
      }
    });
  })
);

// @desc    Get booking statistics
// @route   GET /api/bookings/stats/overview
// @access  Private/Admin
router.get('/stats/overview',
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'active' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Expiring leases (next 30 days)
    const expiringLeases = await Booking.findExpiringLeases(30);
    
    // Average lease duration
    const avgLeaseDuration = await Booking.aggregate([
      {
        $match: { status: { $in: ['active', 'completed'] } }
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$leaseDetails.duration' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalBookings,
          activeBookings,
          pendingBookings,
          completedBookings
        },
        bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        expiringLeases: expiringLeases.length,
        averageLeaseDuration: avgLeaseDuration[0]?.avgDuration || 0
      }
    });
  })
);

export default router;