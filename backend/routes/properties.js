import express from 'express';
import Property from '../models/Property.js';
import User from '../models/User.js';
import { verifyToken, authorize, optionalAuth, checkOwnership } from '../middleware/auth.js';
import { validatePropertyCreation, validatePropertyUpdate, validatePropertySearch, validateObjectIdParam } from '../middleware/validation.js';
import { uploadMultiple } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Get featured properties for landing page
// @route   GET /api/properties/featured
// @access  Public
router.get('/featured', optionalAuth, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  
  // Get featured properties (recently added, high views, or manually featured)
  const featuredProperties = await Property.find({
    isActive: true,
    'availability.status': 'available'
  })
    .populate('owner', 'firstName lastName profileImage')
    .sort({ 
      featured: -1,  // Featured properties first
      views: -1,     // Then by popularity
      createdAt: -1  // Then by recency
    })
    .limit(limit);
  
  res.status(200).json({
    success: true,
    data: {
      properties: featuredProperties
    }
  });
}));

// @desc    Enhanced search for landing page with suggestions
// @route   GET /api/properties/search
// @access  Public
router.get('/search', optionalAuth, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  
  const {
    q, location, minRent, maxRent, bedrooms, bathrooms, propertyType, 
    furnishing, availableFor, amenities, sortBy
  } = req.query;
  
  // Build query
  const query = { 
    isActive: true, 
    'availability.status': 'available' 
  };
  
  // Text search across multiple fields
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { 'location.address': { $regex: q, $options: 'i' } },
      { 'location.city': { $regex: q, $options: 'i' } },
      { 'location.state': { $regex: q, $options: 'i' } }
    ];
  }
  
  // Location filter
  if (location) {
    query['location.city'] = { $regex: location, $options: 'i' };
  }
  
  // Price range
  if (minRent || maxRent) {
    query['rent.amount'] = {};
    if (minRent) query['rent.amount'].$gte = parseFloat(minRent);
    if (maxRent) query['rent.amount'].$lte = parseFloat(maxRent);
  }
  
  // Room filters
  if (bedrooms) {
    query.bedrooms = parseInt(bedrooms);
  }
  
  if (bathrooms) {
    query.bathrooms = parseInt(bathrooms);
  }
  
  // Property type
  if (propertyType) {
    query.propertyType = propertyType;
  }
  
  // Furnishing status
  if (furnishing) {
    query.furnishingStatus = furnishing;
  }
  
  // Available for
  if (availableFor) {
    query['preferences.tenantType'] = availableFor;
  }
  
  // Amenities
  if (amenities) {
    const amenitiesArray = Array.isArray(amenities) ? amenities : amenities.split(',');
    query.amenities = { $in: amenitiesArray };
  }
  
  // Build sort
  let sort = { createdAt: -1 };
  
  switch (sortBy) {
    case 'price_asc':
      sort = { 'rent.amount': 1 };
      break;
    case 'price_desc':
      sort = { 'rent.amount': -1 };
      break;
    case 'date_desc':
      sort = { createdAt: -1 };
      break;
    case 'relevance':
      // For relevance, we can use a combination of factors
      sort = { featured: -1, views: -1, createdAt: -1 };
      break;
  }
  
  const properties = await Property.find(query)
    .populate('owner', 'firstName lastName profileImage')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await Property.countDocuments(query);
  
  // Get available filter options for the current search
  const availableFilters = await Property.aggregate([
    { $match: { isActive: true, 'availability.status': 'available' } },
    {
      $group: {
        _id: null,
        cities: { $addToSet: '$location.city' },
        propertyTypes: { $addToSet: '$propertyType' },
        furnishingOptions: { $addToSet: '$furnishingStatus' },
        availableForOptions: { $addToSet: '$preferences.tenantType' },
        minRent: { $min: '$rent.amount' },
        maxRent: { $max: '$rent.amount' },
        maxBedrooms: { $max: '$bedrooms' },
        maxBathrooms: { $max: '$bathrooms' }
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
      filters: {
        applied: {
          q, location, minRent, maxRent, bedrooms, bathrooms, 
          propertyType, furnishing, availableFor, amenities, sortBy
        },
        available: availableFilters[0] || {}
      }
    }
  });
}));

// @desc    Get search suggestions for autocomplete
// @route   GET /api/properties/suggestions
// @access  Public
router.get('/suggestions', asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
    return res.status(200).json({
      success: true,
      data: { suggestions: [] }
    });
  }
  
  // Get city suggestions
  const citySuggestions = await Property.aggregate([
    {
      $match: {
        isActive: true,
        'location.city': { $regex: q, $options: 'i' }
      }
    },
    {
      $group: {
        _id: '$location.city',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  // Get property title suggestions
  const propertySuggestions = await Property.find({
    isActive: true,
    title: { $regex: q, $options: 'i' }
  })
    .select('title location.city')
    .limit(3);
  
  const suggestions = [
    ...citySuggestions.map(city => ({
      type: 'city',
      text: city._id,
      count: city.count
    })),
    ...propertySuggestions.map(property => ({
      type: 'property',
      text: property.title,
      location: property.location.city
    }))
  ];
  
  res.status(200).json({
    success: true,
    data: { suggestions }
  });
}));

// @desc    Get property statistics
// @route   GET /api/properties/stats/overview
// @access  Private/Admin
router.get('/stats/overview',
  verifyToken,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ isActive: true });
    const availableProperties = await Property.countDocuments({ 
      isActive: true, 
      'availability.status': 'available' 
    });
    
    const propertiesByType = await Property.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const propertiesByCity = await Property.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const averageRent = await Property.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          averageRent: { $avg: '$rent.amount' },
          minRent: { $min: '$rent.amount' },
          maxRent: { $max: '$rent.amount' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalProperties,
          activeProperties,
          availableProperties,
          occupiedProperties: activeProperties - availableProperties
        },
        propertiesByType: propertiesByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        propertiesByCity,
        rentStatistics: averageRent[0] || { averageRent: 0, minRent: 0, maxRent: 0 }
      }
    });
  })
);

// @desc    Get properties by owner
// @route   GET /api/properties/owner/:ownerId
// @access  Private
router.get('/owner/:ownerId',
  verifyToken,
  validateObjectIdParam('ownerId'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Users can only view their own properties unless they're admin
    if (req.user.role !== 'admin' && !req.user._id.equals(req.params.ownerId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const query = { owner: req.params.ownerId };
    
    // Non-owners can only see active properties
    if (!req.user._id.equals(req.params.ownerId) && req.user.role !== 'admin') {
      query.isActive = true;
    }
    
    const properties = await Property.find(query)
      .populate('owner', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
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
  })
);

// @desc    Get all properties with search and filters
// @route   GET /api/properties
// @access  Public
router.get('/', optionalAuth, validatePropertySearch, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  
  const {
    city, minRent, maxRent, bedrooms, propertyType, furnishingStatus,
    amenities, tenantType, sortBy, search
  } = req.query;
  
  // Build query
  const query = { isActive: true };
  
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
    case 'oldest':
      sort = { createdAt: 1 };
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
  
  // Update view count for authenticated users
  if (req.user) {
    await Property.updateMany(
      { _id: { $in: properties.map(p => p._id) } },
      { $inc: { views: 1 } }
    );
  }
  
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

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
router.get('/:id', optionalAuth, validateObjectIdParam('id'), asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('owner', 'firstName lastName profileImage phone email');
  
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }
  
  // Check if property is active or user is owner/admin
  if (!property.isActive && 
      (!req.user || 
       (!req.user._id.equals(property.owner._id) && req.user.role !== 'admin'))) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }
  
  // Increment view count
  property.views += 1;
  await property.save();
  
  res.status(200).json({
    success: true,
    data: {
      property
    }
  });
}));

// @desc    Create property
// @route   POST /api/properties
// @access  Private/Owner
router.post('/', 
  verifyToken,
  authorize('owner', 'admin'),
  uploadMultiple('images', 10),
  validatePropertyCreation,
  asyncHandler(async (req, res) => {
    // Add owner to property data
    const propertyData = {
      ...req.body,
      owner: req.user._id
    };
    
    // Add uploaded images
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map((file, index) => ({
        url: file.path, // Cloudinary returns the full URL in file.path
        caption: req.body.imageCaptions ? req.body.imageCaptions[index] : '',
        isPrimary: index === 0 // First image is primary
      }));
    }
    
    const property = await Property.create(propertyData);
    
    // Update owner's property count
    await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { 'ownerInfo.totalProperties': 1 } }
    );
    
    await property.populate('owner', 'firstName lastName profileImage');
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: {
        property
      }
    });
  })
);

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Owner
router.put('/:id',
  verifyToken,
  validateObjectIdParam('id'),
  checkOwnership('Property'),
  uploadMultiple('images', 10),
  validatePropertyUpdate,
  asyncHandler(async (req, res) => {
    const property = req.resource; // From checkOwnership middleware
    
    // Update property fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        property[key] = req.body[key];
      }
    });
    
    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path, // Cloudinary returns the full URL in file.path
        caption: '',
        isPrimary: false
      }));
      
      property.images = [...property.images, ...newImages];
    }
    
    await property.save();
    await property.populate('owner', 'firstName lastName profileImage');
    
    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: {
        property
      }
    });
  })
);

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Owner
router.delete('/:id',
  verifyToken,
  validateObjectIdParam('id'),
  checkOwnership('Property'),
  asyncHandler(async (req, res) => {
    const property = req.resource;
    
    // Soft delete - deactivate instead of removing
    property.isActive = false;
    await property.save();
    
    // Update owner's property count
    await User.findByIdAndUpdate(
      property.owner,
      { $inc: { 'ownerInfo.totalProperties': -1 } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  })
);

// @desc    Get properties by owner
// @route   GET /api/properties/owner/:ownerId
// @access  Private
router.get('/owner/:ownerId',
  verifyToken,
  validateObjectIdParam('ownerId'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Users can only view their own properties unless they're admin
    if (req.user.role !== 'admin' && !req.user._id.equals(req.params.ownerId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const query = { owner: req.params.ownerId };
    
    // Non-owners can only see active properties
    if (!req.user._id.equals(req.params.ownerId) && req.user.role !== 'admin') {
      query.isActive = true;
    }
    
    const properties = await Property.find(query)
      .populate('owner', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
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
  })
);

// @desc    Update property images
// @route   PUT /api/properties/:id/images
// @access  Private/Owner
router.put('/:id/images',
  verifyToken,
  validateObjectIdParam('id'),
  checkOwnership('Property'),
  uploadMultiple('images', 10),
  asyncHandler(async (req, res) => {
    const property = req.resource;
    const { removeImages, primaryImageIndex } = req.body;
    
    // Remove specified images
    if (removeImages && Array.isArray(removeImages)) {
      property.images = property.images.filter((_, index) => 
        !removeImages.includes(index.toString())
      );
    }
    
    // Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path, // Cloudinary returns the full URL in file.path
        caption: '',
        isPrimary: false
      }));
      
      property.images = [...property.images, ...newImages];
    }
    
    // Set primary image
    if (primaryImageIndex !== undefined) {
      property.images.forEach((img, index) => {
        img.isPrimary = index === parseInt(primaryImageIndex);
      });
    }
    
    await property.save();
    
    res.status(200).json({
      success: true,
      message: 'Property images updated successfully',
      data: {
        images: property.images
      }
    });
  })
);

// @desc    Toggle property availability
// @route   PATCH /api/properties/:id/availability
// @access  Private/Owner
router.patch('/:id/availability',
  verifyToken,
  validateObjectIdParam('id'),
  checkOwnership('Property'),
  asyncHandler(async (req, res) => {
    const property = req.resource;
    const { status, availableFrom } = req.body;
    
    if (status) {
      property.availability.status = status;
    }
    
    if (availableFrom) {
      property.availability.availableFrom = new Date(availableFrom);
    }
    
    await property.save();
    
    res.status(200).json({
      success: true,
      message: 'Property availability updated successfully',
      data: {
        availability: property.availability
      }
    });
  })
);

// @desc    Get property statistics
// @route   GET /api/properties/stats/overview
// @access  Private/Admin
router.get('/stats/overview',
  verifyToken,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ isActive: true });
    const availableProperties = await Property.countDocuments({ 
      isActive: true, 
      'availability.status': 'available' 
    });
    
    const propertiesByType = await Property.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const propertiesByCity = await Property.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const averageRent = await Property.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          averageRent: { $avg: '$rent.amount' },
          minRent: { $min: '$rent.amount' },
          maxRent: { $max: '$rent.amount' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalProperties,
          activeProperties,
          availableProperties,
          occupiedProperties: activeProperties - availableProperties
        },
        propertiesByType: propertiesByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        propertiesByCity,
        rentStatistics: averageRent[0] || { averageRent: 0, minRent: 0, maxRent: 0 }
      }
    });
  })
);

export default router;