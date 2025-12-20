import { body, param, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Custom validator for MongoDB ObjectId
export const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

// User validation rules
export const validateUserRegistration = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
    
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
    
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
  body('role')
    .optional()
    .isIn(['tenant', 'owner', 'admin'])
    .withMessage('Role must be tenant, owner, or admin'),
    
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
    
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
    
  handleValidationErrors
];

export const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
    
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
    
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
    
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  handleValidationErrors
];

// Property validation rules
export const validatePropertyCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Property title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
    
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Property description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
    
  body('propertyType')
    .notEmpty()
    .withMessage('Property type is required')
    .isIn(['apartment', 'house', 'villa', 'studio', 'condo', 'townhouse'])
    .withMessage('Invalid property type'),
    
  body('bedrooms')
    .isInt({ min: 0, max: 20 })
    .withMessage('Bedrooms must be a number between 0 and 20'),
    
  body('bathrooms')
    .isInt({ min: 0, max: 20 })
    .withMessage('Bathrooms must be a number between 0 and 20'),
    
  body('area.value')
    .isFloat({ min: 1 })
    .withMessage('Area must be a positive number'),
    
  body('area.unit')
    .optional()
    .isIn(['sqft', 'sqm'])
    .withMessage('Area unit must be sqft or sqm'),
    
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
    
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
    
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
    
  body('location.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
    
  body('rent.amount')
    .isFloat({ min: 0 })
    .withMessage('Rent amount must be a positive number'),
    
  body('securityDeposit')
    .isFloat({ min: 0 })
    .withMessage('Security deposit must be a positive number'),
    
  body('furnishingStatus')
    .notEmpty()
    .withMessage('Furnishing status is required')
    .isIn(['fully-furnished', 'semi-furnished', 'unfurnished'])
    .withMessage('Invalid furnishing status'),
    
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
    
  body('preferences.tenantType')
    .optional()
    .isIn(['family', 'bachelor', 'company', 'any'])
    .withMessage('Invalid tenant type'),
    
  handleValidationErrors
];

export const validatePropertyUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
    
  body('propertyType')
    .optional()
    .isIn(['apartment', 'house', 'villa', 'studio', 'condo', 'townhouse'])
    .withMessage('Invalid property type'),
    
  body('bedrooms')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Bedrooms must be a number between 0 and 20'),
    
  body('bathrooms')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Bathrooms must be a number between 0 and 20'),
    
  body('rent.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Rent amount must be a positive number'),
    
  body('securityDeposit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Security deposit must be a positive number'),
    
  handleValidationErrors
];

// Booking validation rules
export const validateBookingCreation = [
  body('property')
    .notEmpty()
    .withMessage('Property ID is required')
    .custom(isValidObjectId)
    .withMessage('Invalid property ID'),
    
  body('leaseDetails.startDate')
    .isISO8601()
    .withMessage('Valid start date is required')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
    
  body('leaseDetails.endDate')
    .isISO8601()
    .withMessage('Valid end date is required')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.leaseDetails.startDate);
      
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
    
  body('leaseDetails.duration')
    .isInt({ min: 1, max: 60 })
    .withMessage('Lease duration must be between 1 and 60 months'),
    
  body('financialTerms.monthlyRent')
    .isFloat({ min: 0 })
    .withMessage('Monthly rent must be a positive number'),
    
  body('financialTerms.securityDeposit')
    .isFloat({ min: 0 })
    .withMessage('Security deposit must be a positive number'),
    
  handleValidationErrors
];

// Maintenance validation rules
export const validateMaintenanceRequest = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Maintenance title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
    
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
    
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'plumbing', 'electrical', 'hvac', 'appliances', 'structural',
      'painting', 'flooring', 'doors-windows', 'security', 'cleaning',
      'pest-control', 'landscaping', 'other'
    ])
    .withMessage('Invalid category'),
    
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'emergency'])
    .withMessage('Invalid priority level'),
    
  body('property')
    .notEmpty()
    .withMessage('Property ID is required')
    .custom(isValidObjectId)
    .withMessage('Invalid property ID'),
    
  handleValidationErrors
];

// Review validation rules
export const validateReviewCreation = [
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Review comment is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters'),
    
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
    
  body('property')
    .notEmpty()
    .withMessage('Property ID is required')
    .custom(isValidObjectId)
    .withMessage('Invalid property ID'),
    
  body('reviewType')
    .notEmpty()
    .withMessage('Review type is required')
    .isIn(['property', 'owner', 'tenant'])
    .withMessage('Invalid review type'),
    
  body('detailedRatings.cleanliness')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Cleanliness rating must be between 1 and 5'),
    
  body('detailedRatings.communication')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Communication rating must be between 1 and 5'),
    
  body('detailedRatings.location')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Location rating must be between 1 and 5'),
    
  body('detailedRatings.valueForMoney')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Value for money rating must be between 1 and 5'),
    
  handleValidationErrors
];

// Payment validation rules
export const validatePaymentCreation = [
  body('booking')
    .notEmpty()
    .withMessage('Booking ID is required')
    .custom(isValidObjectId)
    .withMessage('Invalid booking ID'),
    
  body('paymentType')
    .notEmpty()
    .withMessage('Payment type is required')
    .isIn([
      'security-deposit', 'monthly-rent', 'maintenance-charges', 
      'late-fee', 'utility-bill', 'damage-charge', 'refund', 'other'
    ])
    .withMessage('Invalid payment type'),
    
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
    
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['bank-transfer', 'credit-card', 'debit-card', 'upi', 'cash', 'cheque', 'online-banking'])
    .withMessage('Invalid payment method'),
    
  body('dueDate')
    .isISO8601()
    .withMessage('Valid due date is required'),
    
  handleValidationErrors
];

// Query parameter validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  handleValidationErrors
];

export const validatePropertySearch = [
  query('city')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('City must be at least 2 characters'),
    
  query('minRent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum rent must be a positive number'),
    
  query('maxRent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum rent must be a positive number'),
    
  query('bedrooms')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Bedrooms must be between 0 and 20'),
    
  query('propertyType')
    .optional()
    .isIn(['apartment', 'house', 'villa', 'studio', 'condo', 'townhouse'])
    .withMessage('Invalid property type'),
    
  query('furnishingStatus')
    .optional()
    .isIn(['fully-furnished', 'semi-furnished', 'unfurnished'])
    .withMessage('Invalid furnishing status'),
    
  handleValidationErrors
];

// Parameter validation
export const validateObjectIdParam = (paramName = 'id') => [
  param(paramName)
    .custom(isValidObjectId)
    .withMessage(`Invalid ${paramName}`),
    
  handleValidationErrors
];