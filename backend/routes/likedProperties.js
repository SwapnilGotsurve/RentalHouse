import express from 'express';
import LikedProperty from '../models/LikedProperty.js';
import Property from '../models/Property.js';
import { verifyToken } from '../middleware/auth.js';
import { validateObjectIdParam } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Get user's liked properties
// @route   GET /api/liked-properties
// @access  Private
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const likedProperties = await LikedProperty.find({ user: req.user._id })
    .populate({
      path: 'property',
      populate: {
        path: 'owner',
        select: 'firstName lastName profileImage'
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await LikedProperty.countDocuments({ user: req.user._id });
  
  res.status(200).json({
    success: true,
    data: {
      likedProperties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Like/Unlike a property
// @route   POST /api/liked-properties/:propertyId
// @access  Private
router.post('/:propertyId', 
  verifyToken,
  validateObjectIdParam('propertyId'),
  asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.user._id;
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if already liked
    const existingLike = await LikedProperty.findOne({
      user: userId,
      property: propertyId
    });
    
    if (existingLike) {
      // Unlike the property
      await LikedProperty.findByIdAndDelete(existingLike._id);
      
      res.status(200).json({
        success: true,
        message: 'Property removed from favorites',
        data: {
          isLiked: false
        }
      });
    } else {
      // Like the property
      const likedProperty = await LikedProperty.create({
        user: userId,
        property: propertyId,
        notes: req.body.notes || ''
      });
      
      await likedProperty.populate('property');
      
      res.status(201).json({
        success: true,
        message: 'Property added to favorites',
        data: {
          isLiked: true,
          likedProperty
        }
      });
    }
  })
);

// @desc    Check if property is liked by user
// @route   GET /api/liked-properties/check/:propertyId
// @access  Private
router.get('/check/:propertyId',
  verifyToken,
  validateObjectIdParam('propertyId'),
  asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.user._id;
    
    const isLiked = await LikedProperty.isLikedByUser(userId, propertyId);
    
    res.status(200).json({
      success: true,
      data: {
        isLiked
      }
    });
  })
);

// @desc    Remove property from favorites
// @route   DELETE /api/liked-properties/:propertyId
// @access  Private
router.delete('/:propertyId',
  verifyToken,
  validateObjectIdParam('propertyId'),
  asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.user._id;
    
    const likedProperty = await LikedProperty.findOneAndDelete({
      user: userId,
      property: propertyId
    });
    
    if (!likedProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found in favorites'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Property removed from favorites'
    });
  })
);

// @desc    Get property like statistics
// @route   GET /api/liked-properties/stats/:propertyId
// @access  Public
router.get('/stats/:propertyId',
  validateObjectIdParam('propertyId'),
  asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    
    const likeCount = await LikedProperty.getLikeCount(propertyId);
    
    res.status(200).json({
      success: true,
      data: {
        likeCount
      }
    });
  })
);

export default router;