import express from 'express';
import Review from '../models/Review.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import { verifyToken, authorize, optionalAuth } from '../middleware/auth.js';
import { validateReviewCreation, validateObjectIdParam } from '../middleware/validation.js';
import { uploadMultiple } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Get all reviews (public with optional auth)
// @route   GET /api/reviews
// @access  Public
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const { property, reviewType, rating, status, featured } = req.query;
  
  // Build query - only show approved reviews for public access
  const query = { status: 'approved' };
  
  if (property) {
    query.property = property;
  }
  
  if (reviewType) {
    query.reviewType = reviewType;
  }
  
  if (rating) {
    query.rating = parseInt(rating);
  }
  
  if (featured === 'true') {
    query.isFeatured = true;
  }
  
  // Admin can see all reviews
  if (req.user && req.user.role === 'admin' && status) {
    query.status = status;
  }
  
  const reviews = await Review.find(query)
    .populate('property', 'title location images')
    .populate('reviewer', 'firstName lastName profileImage')
    .populate('reviewee', 'firstName lastName profileImage')
    .populate('response.respondedBy', 'firstName lastName profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Review.countDocuments(query);
  
  res.status(200).json({
    success: true,
    data: {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
router.get('/:id', optionalAuth, validateObjectIdParam('id'), asyncHandler(async (req, res) => {
  const query = { _id: req.params.id };
  
  // Only show approved reviews unless user is involved or admin
  if (!req.user || req.user.role !== 'admin') {
    query.status = 'approved';
  }
  
  const review = await Review.findOne(query)
    .populate('property', 'title location images')
    .populate('reviewer', 'firstName lastName profileImage')
    .populate('reviewee', 'firstName lastName profileImage')
    .populate('response.respondedBy', 'firstName lastName profileImage');
  
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }
  
  // Allow access if user is reviewer, reviewee, or admin
  if (req.user && 
      (req.user._id.equals(review.reviewer._id) || 
       req.user._id.equals(review.reviewee._id) || 
       req.user.role === 'admin')) {
    // User has access regardless of status
  } else if (review.status !== 'approved') {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      review
    }
  });
}));

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
router.post('/',
  verifyToken,
  uploadMultiple('images', 3),
  validateReviewCreation,
  asyncHandler(async (req, res) => {
    const {
      property: propertyId,
      comment,
      rating,
      reviewType,
      detailedRatings,
      stayDuration,
      recommendToOthers,
      wouldRentAgain,
      isAnonymous
    } = req.body;
    
    // Verify property exists
    const property = await Property.findById(propertyId).populate('owner');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if user has completed booking for this property (for property reviews)
    if (reviewType === 'property') {
      const completedBooking = await Booking.findOne({
        property: propertyId,
        tenant: req.user._id,
        status: 'completed'
      });
      
      if (!completedBooking) {
        return res.status(403).json({
          success: false,
          message: 'You can only review properties where you have completed a stay'
        });
      }
    }
    
    // Check if user already reviewed this property
    const existingReview = await Review.findOne({
      property: propertyId,
      reviewer: req.user._id,
      reviewType
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this property'
      });
    }
    
    // Prepare review data
    const reviewData = {
      comment,
      rating,
      reviewType,
      property: propertyId,
      reviewer: req.user._id,
      reviewee: property.owner._id,
      detailedRatings: detailedRatings || {},
      stayDuration,
      recommendToOthers,
      wouldRentAgain,
      isAnonymous: isAnonymous || false
    };
    
    // Add uploaded images
    if (req.files && req.files.length > 0) {
      reviewData.images = req.files.map(file => ({
        url: file.url,
        caption: ''
      }));
    }
    
    const review = await Review.create(reviewData);
    
    await review.populate([
      { path: 'property', select: 'title location' },
      { path: 'reviewer', select: 'firstName lastName profileImage' },
      { path: 'reviewee', select: 'firstName lastName profileImage' }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        review
      }
    });
  })
);

// @desc    Update review (only by reviewer)
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id',
  verifyToken,
  validateObjectIdParam('id'),
  uploadMultiple('images', 3),
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Only reviewer can update their review
    if (!req.user._id.equals(review.reviewer)) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }
    
    // Can only update pending or approved reviews
    if (!['pending', 'approved'].includes(review.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update this review'
      });
    }
    
    const {
      comment,
      rating,
      detailedRatings,
      stayDuration,
      recommendToOthers,
      wouldRentAgain
    } = req.body;
    
    // Update fields
    if (comment !== undefined) review.comment = comment;
    if (rating !== undefined) review.rating = rating;
    if (detailedRatings !== undefined) review.detailedRatings = detailedRatings;
    if (stayDuration !== undefined) review.stayDuration = stayDuration;
    if (recommendToOthers !== undefined) review.recommendToOthers = recommendToOthers;
    if (wouldRentAgain !== undefined) review.wouldRentAgain = wouldRentAgain;
    
    // Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.url,
        caption: ''
      }));
      review.images = [...review.images, ...newImages];
    }
    
    // Reset status to pending if it was approved (for re-moderation)
    if (review.status === 'approved') {
      review.status = 'pending';
    }
    
    await review.save();
    
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: {
        review
      }
    });
  })
);

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id',
  verifyToken,
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Only reviewer or admin can delete review
    if (!req.user._id.equals(review.reviewer) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }
    
    await Review.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  })
);

// @desc    Add helpful vote
// @route   POST /api/reviews/:id/helpful
// @access  Private
router.post('/:id/helpful',
  verifyToken,
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const { isHelpful } = req.body;
    
    if (typeof isHelpful !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isHelpful must be true or false'
      });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    if (review.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Can only vote on approved reviews'
      });
    }
    
    // Users cannot vote on their own reviews
    if (req.user._id.equals(review.reviewer)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot vote on your own review'
      });
    }
    
    await review.addHelpfulVote(req.user._id, isHelpful);
    
    res.status(200).json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        helpfulScore: review.helpfulScore
      }
    });
  })
);

// @desc    Add response to review (Owner/Admin)
// @route   POST /api/reviews/:id/response
// @access  Private/Owner/Admin
router.post('/:id/response',
  verifyToken,
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const { comment } = req.body;
    
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Response comment is required'
      });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Only reviewee (property owner) or admin can respond
    if (!req.user._id.equals(review.reviewee) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the property owner or admin can respond to reviews'
      });
    }
    
    if (review.response && review.response.comment) {
      return res.status(400).json({
        success: false,
        message: 'Review already has a response'
      });
    }
    
    await review.addResponse(req.user._id, comment.trim());
    
    await review.populate('response.respondedBy', 'firstName lastName profileImage');
    
    res.status(201).json({
      success: true,
      message: 'Response added successfully',
      data: {
        response: review.response
      }
    });
  })
);

// @desc    Flag review for moderation
// @route   POST /api/reviews/:id/flag
// @access  Private
router.post('/:id/flag',
  verifyToken,
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const { reason, description } = req.body;
    
    const validReasons = ['inappropriate', 'spam', 'fake', 'offensive', 'other'];
    
    if (!reason || !validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: 'Valid reason is required'
      });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Users cannot flag their own reviews
    if (req.user._id.equals(review.reviewer)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot flag your own review'
      });
    }
    
    // Check if user already flagged this review
    const existingFlag = review.moderationFlags.find(flag => 
      flag.flaggedBy.equals(req.user._id)
    );
    
    if (existingFlag) {
      return res.status(400).json({
        success: false,
        message: 'You have already flagged this review'
      });
    }
    
    review.moderationFlags.push({
      flaggedBy: req.user._id,
      reason,
      description: description || ''
    });
    
    await review.save();
    
    res.status(200).json({
      success: true,
      message: 'Review flagged for moderation'
    });
  })
);

// @desc    Get property reviews with statistics
// @route   GET /api/reviews/property/:propertyId
// @access  Public
router.get('/property/:propertyId',
  optionalAuth,
  validateObjectIdParam('propertyId'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const propertyId = req.params.propertyId;
    
    // Get reviews
    const reviews = await Review.find({
      property: propertyId,
      status: 'approved'
    })
      .populate('reviewer', 'firstName lastName profileImage')
      .populate('response.respondedBy', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments({
      property: propertyId,
      status: 'approved'
    });
    
    // Get property rating statistics
    const ratingStats = await Review.getPropertyAverageRating(propertyId);
    
    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        statistics: ratingStats
      }
    });
  })
);

// @desc    Get featured reviews
// @route   GET /api/reviews/featured
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  
  const featuredReviews = await Review.findFeatured()
    .populate('property', 'title location images')
    .populate('reviewer', 'firstName lastName profileImage')
    .limit(limit);
  
  res.status(200).json({
    success: true,
    data: {
      reviews: featuredReviews
    }
  });
}));

// @desc    Update review status (Admin only)
// @route   PATCH /api/reviews/:id/status
// @access  Private/Admin
router.patch('/:id/status',
  verifyToken,
  authorize('admin'),
  validateObjectIdParam('id'),
  asyncHandler(async (req, res) => {
    const { status, isFeatured } = req.body;
    
    const validStatuses = ['pending', 'approved', 'rejected', 'hidden'];
    
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    if (status) {
      review.status = status;
    }
    
    if (isFeatured !== undefined) {
      review.isFeatured = isFeatured;
      if (isFeatured) {
        review.featuredAt = new Date();
      }
    }
    
    await review.save();
    
    res.status(200).json({
      success: true,
      message: 'Review status updated successfully',
      data: {
        review: {
          _id: review._id,
          status: review.status,
          isFeatured: review.isFeatured,
          featuredAt: review.featuredAt
        }
      }
    });
  })
);

export default router;