import express from 'express';
import Property from '../models/Property.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { optionalAuth } from '../middleware/auth.js';
import { validatePropertySearch, validateObjectIdParam } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Get featured properties
// @route   GET /api/public/properties/featured
// @access  Public
router.get('/properties/featured', optionalAuth, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  
  const featuredProperties = await Property.find({
    isActive: true,
    isVerified: true,
    'availability.status': 'available'
  })
    .populate('owner', 'firstName lastName profileImage')
    .sort({ views: -1, createdAt: -1 })
    .limit(limit);
  
  res.status(200).json({
    success: true,
    data: {
      properties: featuredProperties
    }
  });
}));

// @desc    Search properties (public)
// @route   GET /api/public/properties/search
// @access  Public
router.get('/properties/search', optionalAuth, validatePropertySearch, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  
  const {
    city, minRent, maxRent, bedrooms, propertyType, furnishingStatus,
    amenities, tenantType, sortBy, search
  } = req.query;
  
  // Build query - only show active and available properties
  const query = { 
    isActive: true, 
    'availability.status': 'available' 
  };
  
  if (city) {
    query['location.city'] = { $regex: city, $options: 'i' };
  }
  
  if (minRent || maxRent) {
    query['rent.amount'] = {};
    if (minRent) query['rent.amount'].$gte = parseFloat(minRent);
    if (maxRent) query['rent.amount'].$lte = parseFloat(maxRent);
  }
  
  if (bedrooms) {
    query.bedrooms = parseInt(bedrooms);
  }
  
  if (propertyType) {
    query.propertyType = propertyType;
  }
  
  if (furnishingStatus) {
    query.furnishingStatus = furnishingStatus;
  }
  
  if (amenities) {
    const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
    query.amenities = { $in: amenitiesArray };
  }
  
  if (tenantType) {
    query['preferences.tenantType'] = { $in: [tenantType, 'any'] };
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'location.address': { $regex: search, $options: 'i' } },
      { 'location.city': { $regex: search, $options: 'i' } }
    ];
  }
  
  // Build sort
  let sort = { createdAt: -1 };
  
  switch (sortBy) {
    case 'price-low':
      sort = { 'rent.amount': 1 };
      break;
    case 'price-high':
      sort = { 'rent.amount': -1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'popular':
      sort = { views: -1 };
      break;
    case 'area-large':
      sort = { 'area.value': -1 };
      break;
    case 'area-small':
      sort = { 'area.value': 1 };
      break;
  }
  
  const properties = await Property.find(query)
    .populate('owner', 'firstName lastName profileImage')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await Property.countDocuments(query);
  
  res.status(200).json({
    success: true,
    data: {
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get property details (public)
// @route   GET /api/public/properties/:id
// @access  Public
router.get('/properties/:id', optionalAuth, validateObjectIdParam('id'), asyncHandler(async (req, res) => {
  const property = await Property.findOne({
    _id: req.params.id,
    isActive: true
  }).populate('owner', 'firstName lastName profileImage phone email');
  
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }
  
  // Increment view count
  property.views += 1;
  await property.save();
  
  // Get property reviews summary
  const reviewStats = await Review.getPropertyAverageRating(property._id);
  
  // Get recent reviews
  const recentReviews = await Review.find({
    property: property._id,
    status: 'approved'
  })
    .populate('reviewer', 'firstName lastName profileImage')
    .sort({ createdAt: -1 })
    .limit(3);
  
  res.status(200).json({
    success: true,
    data: {
      property,
      reviewStats,
      recentReviews
    }
  });
}));

// @desc    Get similar properties
// @route   GET /api/public/properties/:id/similar
// @access  Public
router.get('/properties/:id/similar', optionalAuth, validateObjectIdParam('id'), asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }
  
  const limit = parseInt(req.query.limit) || 4;
  
  // Find similar properties based on location, type, and price range
  const priceRange = {
    min: property.rent.amount * 0.8,
    max: property.rent.amount * 1.2
  };
  
  const similarProperties = await Property.find({
    _id: { $ne: property._id },
    isActive: true,
    'availability.status': 'available',
    'location.city': property.location.city,
    propertyType: property.propertyType,
    'rent.amount': { $gte: priceRange.min, $lte: priceRange.max }
  })
    .populate('owner', 'firstName lastName profileImage')
    .sort({ views: -1 })
    .limit(limit);
  
  // If not enough similar properties, expand search
  if (similarProperties.length < limit) {
    const additionalProperties = await Property.find({
      _id: { 
        $ne: property._id,
        $nin: similarProperties.map(p => p._id)
      },
      isActive: true,
      'availability.status': 'available',
      'location.city': property.location.city
    })
      .populate('owner', 'firstName lastName profileImage')
      .sort({ views: -1 })
      .limit(limit - similarProperties.length);
    
    similarProperties.push(...additionalProperties);
  }
  
  res.status(200).json({
    success: true,
    data: {
      properties: similarProperties
    }
  });
}));

// @desc    Get testimonials for homepage
// @route   GET /api/public/testimonials
// @access  Public
router.get('/testimonials', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  
  const testimonials = await Review.find({
    status: 'approved',
    isFeatured: true
  })
    .populate('reviewer', 'firstName lastName profileImage')
    .populate('property', 'title location')
    .sort({ featuredAt: -1 })
    .limit(limit);
  
  // If not enough featured testimonials, get regular approved ones
  if (testimonials.length < limit) {
    const additionalTestimonials = await Review.find({
      _id: { $nin: testimonials.map(t => t._id) },
      status: 'approved',
      rating: { $gte: 4 } // Only high-rated reviews
    })
      .populate('reviewer', 'firstName lastName profileImage')
      .populate('property', 'title location')
      .sort({ createdAt: -1 })
      .limit(limit - testimonials.length);
    
    testimonials.push(...additionalTestimonials);
  }
  
  res.status(200).json({
    success: true,
    data: {
      testimonials
    }
  });
}));

// @desc    Get property statistics for homepage
// @route   GET /api/public/stats
// @access  Public
router.get('/stats', asyncHandler(async (req, res) => {
  const totalProperties = await Property.countDocuments({ isActive: true });
  const availableProperties = await Property.countDocuments({ 
    isActive: true, 
    'availability.status': 'available' 
  });
  const totalUsers = await User.countDocuments({ isActive: true });
  const totalReviews = await Review.countDocuments({ status: 'approved' });
  
  // Get popular cities
  const popularCities = await Property.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$location.city',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 6 }
  ]);
  
  // Get property types distribution
  const propertyTypes = await Property.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$propertyType',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
  
  // Get average rent by city (top 5 cities)
  const rentByCity = await Property.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$location.city',
        averageRent: { $avg: '$rent.amount' },
        count: { $sum: 1 }
      }
    },
    { $match: { count: { $gte: 3 } } }, // Only cities with at least 3 properties
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalProperties,
        availableProperties,
        totalUsers,
        totalReviews
      },
      popularCities: popularCities.map(city => ({
        name: city._id,
        count: city.count
      })),
      propertyTypes: propertyTypes.reduce((acc, type) => {
        acc[type._id] = type.count;
        return acc;
      }, {}),
      rentByCity: rentByCity.map(city => ({
        name: city._id,
        averageRent: Math.round(city.averageRent),
        count: city.count
      }))
    }
  });
}));

// @desc    Get search suggestions
// @route   GET /api/public/search-suggestions
// @access  Public
router.get('/search-suggestions', asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Query must be at least 2 characters long'
    });
  }
  
  const limit = parseInt(req.query.limit) || 10;
  
  // Get city suggestions
  const citySuggestions = await Property.aggregate([
    {
      $match: {
        isActive: true,
        'location.city': { $regex: query, $options: 'i' }
      }
    },
    {
      $group: {
        _id: '$location.city',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
  
  // Get property title suggestions
  const propertySuggestions = await Property.find({
    isActive: true,
    title: { $regex: query, $options: 'i' }
  })
    .select('title location.city')
    .limit(limit);
  
  res.status(200).json({
    success: true,
    data: {
      cities: citySuggestions.map(city => ({
        name: city._id,
        count: city.count,
        type: 'city'
      })),
      properties: propertySuggestions.map(property => ({
        title: property.title,
        city: property.location.city,
        type: 'property'
      }))
    }
  });
}));

// @desc    Contact property owner
// @route   POST /api/public/properties/:id/contact
// @access  Public
router.post('/properties/:id/contact', validateObjectIdParam('id'), asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required'
    });
  }
  
  const property = await Property.findOne({
    _id: req.params.id,
    isActive: true
  }).populate('owner', 'firstName lastName email');
  
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }
  
  // Increment inquiries count
  property.inquiries += 1;
  await property.save();
  
  // In a real application, you would send an email to the property owner
  // For now, we'll just return success
  
  res.status(200).json({
    success: true,
    message: 'Your inquiry has been sent to the property owner. They will contact you soon.',
    data: {
      contactInfo: {
        ownerName: `${property.owner.firstName} ${property.owner.lastName}`,
        propertyTitle: property.title
      }
    }
  });
}));

// @desc    Get property availability calendar
// @route   GET /api/public/properties/:id/availability
// @access  Public
router.get('/properties/:id/availability', validateObjectIdParam('id'), asyncHandler(async (req, res) => {
  const property = await Property.findOne({
    _id: req.params.id,
    isActive: true
  });
  
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }
  
  // Get current and future bookings for this property
  const bookings = await Booking.find({
    property: property._id,
    status: { $in: ['approved', 'active'] },
    'leaseDetails.endDate': { $gte: new Date() }
  }).select('leaseDetails.startDate leaseDetails.endDate status');
  
  // Calculate available periods
  const availability = {
    status: property.availability.status,
    availableFrom: property.availability.availableFrom,
    leaseDuration: property.availability.leaseDuration,
    currentBookings: bookings.map(booking => ({
      startDate: booking.leaseDetails.startDate,
      endDate: booking.leaseDetails.endDate,
      status: booking.status
    }))
  };
  
  res.status(200).json({
    success: true,
    data: {
      availability
    }
  });
}));

// @desc    Submit property inquiry
// @route   POST /api/public/inquiries
// @access  Public
router.post('/inquiries', asyncHandler(async (req, res) => {
  const { 
    propertyId, 
    name, 
    email, 
    phone, 
    message, 
    inquiryType,
    preferredContactMethod,
    moveInDate 
  } = req.body;
  
  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required'
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  
  let property = null;
  if (propertyId) {
    property = await Property.findOne({
      _id: propertyId,
      isActive: true
    }).populate('owner', 'firstName lastName email');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Increment inquiries count
    property.inquiries += 1;
    await property.save();
  }
  
  // In a real application, you would:
  // 1. Store the inquiry in a database
  // 2. Send email notifications to property owner
  // 3. Send confirmation email to inquirer
  // 4. Create follow-up tasks
  
  const inquiryData = {
    property: property ? {
      id: property._id,
      title: property.title,
      location: property.location.city,
      owner: property.owner
    } : null,
    inquirer: {
      name,
      email,
      phone
    },
    message,
    inquiryType: inquiryType || 'general',
    preferredContactMethod: preferredContactMethod || 'email',
    moveInDate,
    submittedAt: new Date()
  };
  
  res.status(201).json({
    success: true,
    message: property 
      ? 'Your inquiry has been sent to the property owner. They will contact you soon.'
      : 'Your inquiry has been received. Our team will contact you soon.',
    data: {
      inquiry: inquiryData
    }
  });
}));

export default router;