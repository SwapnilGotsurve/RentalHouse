import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
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
  
  // Booking Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Lease Terms
  leaseDetails: {
    startDate: {
      type: Date,
      required: [true, 'Lease start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'Lease end date is required']
    },
    duration: {
      type: Number, // in months
      required: [true, 'Lease duration is required']
    },
    renewalOption: {
      type: Boolean,
      default: false
    }
  },
  
  // Financial Terms
  financialTerms: {
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [0, 'Monthly rent cannot be negative']
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
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  
  // Payment Information
  paymentDetails: {
    securityDepositPaid: {
      type: Boolean,
      default: false
    },
    securityDepositDate: Date,
    firstRentPaid: {
      type: Boolean,
      default: false
    },
    firstRentDate: Date,
    paymentMethod: {
      type: String,
      enum: ['bank-transfer', 'credit-card', 'debit-card', 'cash', 'cheque']
    }
  },
  
  // Documents
  documents: [{
    type: {
      type: String,
      enum: ['lease-agreement', 'id-proof', 'income-proof', 'bank-statement', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Terms and Conditions
  terms: {
    petPolicy: String,
    smokingPolicy: String,
    guestPolicy: String,
    maintenanceResponsibility: String,
    utilitiesIncluded: [String],
    specialConditions: String
  },
  
  // Communication
  messages: [{
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
  
  // Important Dates
  importantDates: {
    applicationDate: {
      type: Date,
      default: Date.now
    },
    approvalDate: Date,
    moveInDate: Date,
    moveOutDate: Date,
    nextRentDue: Date,
    lastInspectionDate: Date,
    nextInspectionDate: Date
  },
  
  // Booking Notes
  notes: {
    tenantNotes: String,
    ownerNotes: String,
    adminNotes: String
  },
  
  // Emergency Contacts
  emergencyContacts: [{
    name: String,
    relationship: String,
    phone: String,
    email: String
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

// Virtual for lease duration in years
bookingSchema.virtual('leaseDurationYears').get(function() {
  return Math.round((this.leaseDetails.duration / 12) * 10) / 10;
});

// Virtual for remaining lease days
bookingSchema.virtual('remainingDays').get(function() {
  if (this.leaseDetails.endDate) {
    const today = new Date();
    const endDate = new Date(this.leaseDetails.endDate);
    const diffTime = endDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for lease progress percentage
bookingSchema.virtual('leaseProgress').get(function() {
  if (this.leaseDetails.startDate && this.leaseDetails.endDate) {
    const today = new Date();
    const startDate = new Date(this.leaseDetails.startDate);
    const endDate = new Date(this.leaseDetails.endDate);
    
    if (today < startDate) return 0;
    if (today > endDate) return 100;
    
    const totalDuration = endDate - startDate;
    const elapsed = today - startDate;
    return Math.round((elapsed / totalDuration) * 100);
  }
  return 0;
});

// Pre-save middleware to calculate total amount
bookingSchema.pre('save', function(next) {
  if (this.isModified('financialTerms')) {
    this.financialTerms.totalAmount = 
      this.financialTerms.securityDeposit + 
      this.financialTerms.monthlyRent + 
      this.financialTerms.maintenanceCharges;
  }
  
  // Set next rent due date
  if (this.status === 'active' && this.leaseDetails.startDate) {
    const startDate = new Date(this.leaseDetails.startDate);
    const nextMonth = new Date(startDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    this.importantDates.nextRentDue = nextMonth;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Static method to find active bookings
bookingSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find expiring leases
bookingSchema.statics.findExpiringLeases = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    status: 'active',
    'leaseDetails.endDate': { $lte: futureDate }
  });
};

// Method to extend lease
bookingSchema.methods.extendLease = function(additionalMonths) {
  const currentEndDate = new Date(this.leaseDetails.endDate);
  currentEndDate.setMonth(currentEndDate.getMonth() + additionalMonths);
  
  this.leaseDetails.endDate = currentEndDate;
  this.leaseDetails.duration += additionalMonths;
  
  return this.save();
};

// Indexes for better query performance
bookingSchema.index({ property: 1 });
bookingSchema.index({ tenant: 1 });
bookingSchema.index({ owner: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'leaseDetails.startDate': 1 });
bookingSchema.index({ 'leaseDetails.endDate': 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;