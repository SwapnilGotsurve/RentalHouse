import mongoose from 'mongoose';

const rentalRequestSchema = new mongoose.Schema({
  // Basic Information
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tenant is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  
  // Request Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  
  // Tenant Information
  tenantDetails: {
    occupation: {
      type: String,
      required: [true, 'Occupation is required']
    },
    monthlyIncome: {
      type: Number,
      required: [true, 'Monthly income is required'],
      min: [0, 'Income cannot be negative']
    },
    familySize: {
      type: Number,
      required: [true, 'Family size is required'],
      min: [1, 'Family size must be at least 1']
    },
    hasPets: {
      type: Boolean,
      default: false
    },
    petDetails: String,
    smokingHabits: {
      type: String,
      enum: ['non-smoker', 'occasional', 'regular'],
      default: 'non-smoker'
    },
    previousRentalHistory: String,
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      email: String
    }
  },
  
  // Lease Preferences
  leasePreferences: {
    preferredStartDate: {
      type: Date,
      required: [true, 'Preferred start date is required']
    },
    preferredDuration: {
      type: Number, // in months
      required: [true, 'Preferred lease duration is required'],
      min: [1, 'Lease duration must be at least 1 month']
    },
    maxRentBudget: {
      type: Number,
      required: [true, 'Maximum rent budget is required'],
      min: [0, 'Budget cannot be negative']
    }
  },
  
  // Documents
  documents: [{
    type: {
      type: String,
      enum: ['id-proof', 'income-proof', 'bank-statement', 'employment-letter', 'previous-lease', 'references', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    fileName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // References
  references: [{
    name: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: String,
    address: String
  }],
  
  // Additional Information
  message: {
    type: String,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  
  // Owner Response
  ownerResponse: {
    message: String,
    responseDate: Date,
    interviewScheduled: {
      date: Date,
      time: String,
      location: String,
      type: {
        type: String,
        enum: ['in-person', 'video-call', 'phone-call']
      }
    }
  },
  
  // Application Tracking
  applicationNumber: {
    type: String,
    unique: true
  },
  
  // Important Dates
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  approvedAt: Date,
  rejectedAt: Date,
  
  // Communication History
  communications: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
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

// Virtual for days since application
rentalRequestSchema.virtual('daysSinceApplication').get(function() {
  const today = new Date();
  const applicationDate = new Date(this.submittedAt);
  const diffTime = today - applicationDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for status color
rentalRequestSchema.virtual('statusColor').get(function() {
  const colors = {
    pending: '#F59E0B',
    approved: '#10B981',
    rejected: '#EF4444',
    withdrawn: '#6B7280'
  };
  return colors[this.status] || '#6B7280';
});

// Pre-save middleware to generate application number
rentalRequestSchema.pre('save', function(next) {
  if (this.isNew && !this.applicationNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.applicationNumber = `APP-${timestamp.slice(-6)}${random}`;
  }
  
  // Update status timestamps
  if (this.isModified('status')) {
    const now = new Date();
    switch (this.status) {
      case 'approved':
        if (!this.approvedAt) {
          this.approvedAt = now;
        }
        break;
      case 'rejected':
        if (!this.rejectedAt) {
          this.rejectedAt = now;
        }
        break;
    }
    
    if (this.status !== 'pending' && !this.reviewedAt) {
      this.reviewedAt = now;
    }
  }
  
  this.updatedAt = Date.now();
  next();
});

// Static method to find by status
rentalRequestSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

// Static method to find by owner
rentalRequestSchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId })
    .populate('property tenant')
    .sort({ createdAt: -1 });
};

// Static method to find by tenant
rentalRequestSchema.statics.findByTenant = function(tenantId) {
  return this.find({ tenant: tenantId })
    .populate('property owner')
    .sort({ createdAt: -1 });
};

// Method to add communication
rentalRequestSchema.methods.addCommunication = function(senderId, message) {
  this.communications.push({
    sender: senderId,
    message,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to approve request
rentalRequestSchema.methods.approve = function(ownerMessage = '') {
  this.status = 'approved';
  this.ownerResponse.message = ownerMessage;
  this.ownerResponse.responseDate = new Date();
  
  return this.save();
};

// Method to reject request
rentalRequestSchema.methods.reject = function(ownerMessage = '') {
  this.status = 'rejected';
  this.ownerResponse.message = ownerMessage;
  this.ownerResponse.responseDate = new Date();
  
  return this.save();
};

// Indexes for better query performance
rentalRequestSchema.index({ property: 1 });
rentalRequestSchema.index({ tenant: 1 });
rentalRequestSchema.index({ owner: 1 });
rentalRequestSchema.index({ status: 1 });
rentalRequestSchema.index({ applicationNumber: 1 });
rentalRequestSchema.index({ submittedAt: -1 });
rentalRequestSchema.index({ createdAt: -1 });

const RentalRequest = mongoose.model('RentalRequest', rentalRequestSchema);

export default RentalRequest;