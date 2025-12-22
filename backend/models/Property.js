import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Property Details
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['apartment', 'house', 'villa', 'studio', 'condo', 'townhouse']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative'],
    max: [20, 'Bedrooms cannot exceed 20']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms cannot be negative'],
    max: [20, 'Bathrooms cannot exceed 20']
  },
  area: {
    value: {
      type: Number,
      required: [true, 'Property area is required'],
      min: [1, 'Area must be positive']
    },
    unit: {
      type: String,
      enum: ['sqft', 'sqm'],
      default: 'sqft'
    }
  },
  
  // Location
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required']
    },
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    nearbyLandmarks: [String]
  },
  
  // Financial Information
  rent: {
    amount: {
      type: Number,
      required: [true, 'Rent amount is required'],
      min: [0, 'Rent cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    period: {
      type: String,
      enum: ['monthly', 'weekly', 'daily'],
      default: 'monthly'
    }
  },
  securityDeposit: {
    type: Number,
    required: [true, 'Security deposit is required'],
    min: [0, 'Security deposit cannot be negative']
  },
  maintenanceCharges: {
    type: Number,
    default: 0,
    min: [0, 'Maintenance charges cannot be negative']
  },
  
  // Property Features
  furnishingStatus: {
    type: String,
    required: [true, 'Furnishing status is required'],
    enum: ['fully-furnished', 'semi-furnished', 'unfurnished']
  },
  amenities: [{
    type: String,
    enum: [
      'parking', 'gym', 'swimming-pool', 'security', 'power-backup',
      'elevator', 'garden', 'balcony', 'terrace', 'club-house',
      'playground', 'wifi', 'ac', 'heating', 'laundry', 'dishwasher',
      'refrigerator', 'microwave', 'tv', 'sofa', 'bed', 'wardrobe'
    ]
  }],
  
  // Availability
  availability: {
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance', 'inactive'],
      default: 'available'
    },
    availableFrom: {
      type: Date,
      default: Date.now
    },
    leaseDuration: {
      min: { type: Number, default: 6 }, // months
      max: { type: Number, default: 24 } // months
    }
  },
  
  // Preferences
  preferences: {
    tenantType: {
      type: String,
      enum: ['family', 'bachelor', 'company', 'any'],
      default: 'any'
    },
    petPolicy: {
      type: String,
      enum: ['allowed', 'not-allowed', 'negotiable'],
      default: 'not-allowed'
    },
    smokingPolicy: {
      type: String,
      enum: ['allowed', 'not-allowed', 'outdoor-only'],
      default: 'not-allowed'
    }
  },
  
  // Media
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  virtualTourUrl: String,
  
  // Owner Information
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Property owner is required']
  },
  
  // Property Management
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  featured: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  views: {
    type: Number,
    default: 0
  },
  inquiries: {
    type: Number,
    default: 0
  },
  
  // SEO
  slug: {
    type: String,
    unique: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for property type display
propertySchema.virtual('propertyTypeDisplay').get(function() {
  if (!this.propertyType) return '';
  return this.propertyType.charAt(0).toUpperCase() + this.propertyType.slice(1);
});

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} ${this.location.zipCode}`;
});

// Virtual for BHK format
propertySchema.virtual('bhkFormat').get(function() {
  return `${this.bedrooms} BHK`;
});

// Virtual for primary image
propertySchema.virtual('primaryImage').get(function() {
  if (!this.images || !Array.isArray(this.images) || this.images.length === 0) {
    return null;
  }
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : this.images[0].url;
});

// Virtual fields to match frontend expectations
propertySchema.virtual('rentAmount').get(function() {
  return this.rent?.amount || 0;
});

propertySchema.virtual('depositAmount').get(function() {
  return this.securityDeposit;
});

propertySchema.virtual('furnishingType').get(function() {
  return this.furnishingStatus;
});

propertySchema.virtual('tenantPreference').get(function() {
  return this.preferences?.tenantType || 'any';
});

propertySchema.virtual('areaValue').get(function() {
  return this.area?.value || 0;
});

// Pre-save middleware to generate slug
propertySchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '-' + this._id.toString().slice(-6);
  }
  this.updatedAt = Date.now();
  next();
});

// Pre-save middleware to ensure only one primary image
propertySchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    let primaryCount = 0;
    this.images.forEach((img, index) => {
      if (img.isPrimary) {
        primaryCount++;
        if (primaryCount > 1) {
          img.isPrimary = false;
        }
      }
    });
    
    // If no primary image, make the first one primary
    if (primaryCount === 0) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

// Static method to find available properties
propertySchema.statics.findAvailable = function() {
  return this.find({
    isActive: true,
    'availability.status': 'available'
  });
};

// Static method to search properties
propertySchema.statics.searchProperties = function(filters) {
  const query = { isActive: true };
  
  if (filters.city) {
    query['location.city'] = new RegExp(filters.city, 'i');
  }
  
  if (filters.minRent || filters.maxRent) {
    query['rent.amount'] = {};
    if (filters.minRent) query['rent.amount'].$gte = filters.minRent;
    if (filters.maxRent) query['rent.amount'].$lte = filters.maxRent;
  }
  
  if (filters.bedrooms) {
    query.bedrooms = filters.bedrooms;
  }
  
  if (filters.propertyType) {
    query.propertyType = filters.propertyType;
  }
  
  if (filters.furnishingStatus) {
    query.furnishingStatus = filters.furnishingStatus;
  }
  
  if (filters.amenities && filters.amenities.length > 0) {
    query.amenities = { $in: filters.amenities };
  }
  
  return this.find(query);
};

// Indexes for better query performance
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ 'rent.amount': 1 });
propertySchema.index({ bedrooms: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ 'availability.status': 1 });
propertySchema.index({ isActive: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ slug: 1 });

const Property = mongoose.model('Property', propertySchema);

export default Property;