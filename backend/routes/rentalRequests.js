import express from 'express';
import RentalRequest from '../models/RentalRequest.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import { verifyToken, authorize } from '../middleware/auth.js';
import { validateObjectIdParam } from '../middleware/validation.js';
import { uploadMultiple } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Create rental request
// @route   POST /api/rental-requests
// @access  Private/Tenant
router.post('/',
  verifyToken,
  authorize('tenant'),
  uploadMultiple('documents', 5),
  asyncHandler(async (req, res) => {
    const {
      propertyId,
      occupation,
      monthlyIncome,
      familySize,
      hasPets,
      petDetails,
      smokingHabits,
      previousRentalHistory,
      emergencyContact,
      preferredStartDate,
      preferredDuration,
      maxRentBudget,
      references,
      message
    } = req.body;
    
    // Check if property exists and is available
    const property = await Property.findById(propertyId).populate('owner');
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    if (!property.owner || !property.owner._id) {
      return res.status(400).json({
        success: false,
        message: 'Property owner information is missing'
      });
    }
    
    if (property.availability.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for rent'
      });
    }
    
    // Check if user already has a pending request for this property
    const existingRequest = await RentalRequest.findOne({
      property: propertyId,
      tenant: req.user._id,
      status: 'pending'
    });
    
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request for this property'
      });
    }
    
    // Prepare documents array
    const documents = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        documents.push({
          type: req.body.documentTypes ? req.body.documentTypes[index] : 'other',
          url: file.path,
          fileName: file.originalname
        });
      });
    }
    
    // Parse references if provided
    let parsedReferences = [];
    if (references) {
      try {
        parsedReferences = typeof references === 'string' ? JSON.parse(references) : references;
      } catch (error) {
        parsedReferences = [];
      }
    }
    
    // Parse emergency contact if provided
    let parsedEmergencyContact = {};
    if (emergencyContact) {
      try {
        parsedEmergencyContact = typeof emergencyContact === 'string' ? JSON.parse(emergencyContact) : emergencyContact;
      } catch (error) {
        parsedEmergencyContact = {};
      }
    }
    
    // Validate and parse numeric fields
    if (!occupation || occupation.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Occupation is required'
      });
    }

    const parsedMonthlyIncome = parseFloat(monthlyIncome);
    if (isNaN(parsedMonthlyIncome) || monthlyIncome === '' || monthlyIncome === null || monthlyIncome === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Monthly income must be a valid number'
      });
    }

    const parsedFamilySize = parseInt(familySize);
    if (isNaN(parsedFamilySize) || familySize === '' || familySize === null || familySize === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Family size must be a valid number'
      });
    }

    const parsedMaxRentBudget = parseFloat(maxRentBudget);
    if (isNaN(parsedMaxRentBudget) || maxRentBudget === '' || maxRentBudget === null || maxRentBudget === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Maximum rent budget must be a valid number'
      });
    }

    // Create rental request
    const rentalRequest = await RentalRequest.create({
      property: propertyId,
      tenant: req.user._id,
      owner: property.owner._id,
      tenantDetails: {
        occupation: occupation.trim(),
        monthlyIncome: parsedMonthlyIncome,
        familySize: parsedFamilySize,
        hasPets: hasPets === 'true' || hasPets === true,
        petDetails,
        smokingHabits,
        previousRentalHistory,
        emergencyContact: parsedEmergencyContact
      },
      leasePreferences: {
        preferredStartDate: new Date(preferredStartDate),
        preferredDuration: parseInt(preferredDuration),
        maxRentBudget: parsedMaxRentBudget
      },
      documents,
      references: parsedReferences,
      message
    });
    
    await rentalRequest.populate([
      { path: 'property', select: 'title location rent images propertyType', options: { lean: false } },
      { path: 'tenant', select: 'firstName lastName email phone' },
      { path: 'owner', select: 'firstName lastName email phone' }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Rental request submitted successfully',
      data: {
        rentalRequest
      }
    });
  })
);

// @desc    Get rental requests for tenant
// @route   GET /api/rental-requests/tenant
// @access  Private/Tenant
router.get('/tenant',
  verifyToken,
  authorize('tenant'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    
    const query = { tenant: req.user._id };
    if (status) {
      query.status = status;
    }
    
    const requests = await RentalRequest.find(query)
      .populate([
        { 
          path: 'property', 
          select: 'title location rent images availability',
          populate: {
            path: 'owner',
            select: 'firstName lastName email phone'
          }
        }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await RentalRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  })
);

// @desc    Get rental requests for owner
// @route   GET /api/rental-requests/owner
// @access  Private/Owner
router.get('/owner',
  verifyToken,
  authorize('owner'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    
    const query = { owner: req.user._id };
    if (status) {
      query.status = status;
    }
    
    const requests = await RentalRequest.find(query)
      .populate([
        { 
          path: 'property', 
          select: 'title location rent images'
        },
        {
          path: 'tenant',
          select: 'firstName lastName email phone profileImage'
        }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await RentalRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  })
);

// @desc    Get single rental request
// @route   GET /api/rental-requests/:id
// @access  Private
router.get('/:id',
  verifyToken,
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const request = await RentalRequest.findById(req.params.id)
      .populate([
        { 
          path: 'property',
          populate: {
            path: 'owner',
            select: 'firstName lastName email phone'
          }
        },
        {
          path: 'tenant',
          select: 'firstName lastName email phone profileImage'
        },
        {
          path: 'communications.sender',
          select: 'firstName lastName'
        }
      ]);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }
    
    // Check if user has access to this request
    const isOwner = request.owner._id.equals(req.user._id);
    const isTenant = request.tenant._id.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isTenant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        request
      }
    });
  })
);

// @desc    Update rental request status (Owner only)
// @route   PATCH /api/rental-requests/:id/status
// @access  Private/Owner
router.patch('/:id/status',
  verifyToken,
  authorize('owner'),
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const { status, message } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved or rejected'
      });
    }
    
    const request = await RentalRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }
    
    // Check if user owns the property
    if (!request.owner.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Update request status
    if (status === 'approved') {
      await request.approve(message);
      
      // Check if property is still available
      const property = await Property.findById(request.property);
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }
      
      // Check if there's already an active booking for this property
      const existingBooking = await Booking.findOne({
        property: request.property,
        status: { $in: ['active', 'approved'] }
      });
      
      if (existingBooking) {
        // Revert the approval
        request.status = 'pending';
        await request.save();
        return res.status(400).json({
          success: false,
          message: 'Property is already booked by another tenant'
        });
      }
      
      // Create a booking from the approved rental request
      const startDate = new Date(request.leasePreferences.preferredStartDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + request.leasePreferences.preferredDuration);
      
      const monthlyRent = property.rent?.amount || 0;
      const securityDeposit = monthlyRent * 2; // Typically 2 months rent
      
      await Booking.create({
        property: request.property,
        tenant: request.tenant,
        owner: request.owner,
        status: 'approved',
        leaseDetails: {
          startDate: startDate,
          endDate: endDate,
          duration: request.leasePreferences.preferredDuration,
          renewalOption: false
        },
        financialTerms: {
          monthlyRent: monthlyRent,
          securityDeposit: securityDeposit,
          maintenanceCharges: 0,
          totalAmount: monthlyRent + securityDeposit,
          currency: 'INR'
        },
        importantDates: {
          applicationDate: request.createdAt,
          approvalDate: new Date(),
          moveInDate: startDate
        },
        terms: {
          petPolicy: request.tenantDetails.hasPets ? 'Pets allowed' : 'No pets',
          smokingPolicy: request.tenantDetails.smokingHabits || 'Non-smoker',
          utilitiesIncluded: []
        }
      });
      
      // Update property availability
      property.availability.status = 'occupied';
      property.availability.availableFrom = null;
      await property.save();
      
      // Add notification to tenant
      await User.findByIdAndUpdate(request.tenant, {
        $push: {
          notifications: {
            type: 'rental_approved',
            title: 'Rental Application Approved! 🎉',
            message: `Your rental application for "${property.title}" has been approved by the owner.`,
            rentalRequest: request._id,
            property: request.property,
            read: false,
            createdAt: new Date()
          }
        }
      });
      
    } else {
      await request.reject(message);
      
      // Add notification to tenant
      const property = await Property.findById(request.property);
      await User.findByIdAndUpdate(request.tenant, {
        $push: {
          notifications: {
            type: 'rental_rejected',
            title: 'Rental Application Update',
            message: message 
              ? `Your rental application for "${property?.title || 'the property'}" has been rejected. Reason: ${message}`
              : `Your rental application for "${property?.title || 'the property'}" has been rejected.`,
            rentalRequest: request._id,
            property: request.property,
            read: false,
            createdAt: new Date()
          }
        }
      });
    }
    
    await request.populate([
      { path: 'property', select: 'title location' },
      { path: 'tenant', select: 'firstName lastName email' }
    ]);
    
    res.status(200).json({
      success: true,
      message: `Rental request ${status} successfully`,
      data: {
        request
      }
    });
  })
);

// @desc    Add communication to rental request
// @route   POST /api/rental-requests/:id/communicate
// @access  Private
router.post('/:id/communicate',
  verifyToken,
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }
    
    const request = await RentalRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }
    
    // Check if user has access to this request
    const isOwner = request.owner.equals(req.user._id);
    const isTenant = request.tenant.equals(req.user._id);
    
    if (!isOwner && !isTenant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    await request.addCommunication(req.user._id, message.trim());
    
    await request.populate([
      {
        path: 'communications.sender',
        select: 'firstName lastName'
      }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        communication: request.communications[request.communications.length - 1]
      }
    });
  })
);

// @desc    Withdraw rental request (Tenant only)
// @route   PATCH /api/rental-requests/:id/withdraw
// @access  Private/Tenant
router.patch('/:id/withdraw',
  verifyToken,
  authorize('tenant'),
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const request = await RentalRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }
    
    // Check if user is the tenant
    if (!request.tenant.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Can only withdraw pending requests
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only withdraw pending requests'
      });
    }
    
    request.status = 'withdrawn';
    await request.save();
    
    res.status(200).json({
      success: true,
      message: 'Rental request withdrawn successfully',
      data: {
        request
      }
    });
  })
);

// @desc    Get rental request statistics
// @route   GET /api/rental-requests/stats/overview
// @access  Private/Owner
router.get('/stats/overview',
  verifyToken,
  authorize('owner'),
  asyncHandler(async (req, res) => {
    const ownerId = req.user._id;
    
    const totalRequests = await RentalRequest.countDocuments({ owner: ownerId });
    const pendingRequests = await RentalRequest.countDocuments({ owner: ownerId, status: 'pending' });
    const approvedRequests = await RentalRequest.countDocuments({ owner: ownerId, status: 'approved' });
    const rejectedRequests = await RentalRequest.countDocuments({ owner: ownerId, status: 'rejected' });
    
    // Recent requests (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRequests = await RentalRequest.countDocuments({
      owner: ownerId,
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        recentRequests
      }
    });
  })
);

export default router;