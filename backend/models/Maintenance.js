import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Maintenance title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Request Details
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'plumbing', 'electrical', 'hvac', 'appliances', 'structural',
      'painting', 'flooring', 'doors-windows', 'security', 'cleaning',
      'pest-control', 'landscaping', 'other'
    ]
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'in-progress', 'completed', 'cancelled', 'on-hold'],
    default: 'pending'
  },
  
  // Related Entities
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
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Could be maintenance staff or contractor
  },
  
  // Location within Property
  location: {
    room: String,
    area: String,
    specificLocation: String
  },
  
  // Media
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Cost Information
  costEstimate: {
    amount: {
      type: Number,
      min: [0, 'Cost cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    breakdown: [{
      item: String,
      cost: Number,
      quantity: Number
    }]
  },
  actualCost: {
    amount: {
      type: Number,
      min: [0, 'Cost cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    receipt: String // URL to receipt image
  },
  
  // Timeline
  timeline: {
    requestedDate: {
      type: Date,
      default: Date.now
    },
    acknowledgedDate: Date,
    scheduledDate: Date,
    startedDate: Date,
    completedDate: Date,
    estimatedCompletionDate: Date
  },
  
  // Communication
  updates: [{
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: String,
    images: [String],
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tenant Feedback
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  
  // Recurring Maintenance
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringDetails: {
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'semi-annually', 'annually']
    },
    nextDueDate: Date,
    lastCompletedDate: Date
  },
  
  // Emergency Details
  isEmergency: {
    type: Boolean,
    default: false
  },
  emergencyDetails: {
    reportedTime: Date,
    responseTime: Date, // When first acknowledged
    resolutionTime: Date, // When completed
    escalationLevel: {
      type: Number,
      min: 1,
      max: 3,
      default: 1
    }
  },
  
  // Warranty Information
  warranty: {
    isUnderWarranty: {
      type: Boolean,
      default: false
    },
    warrantyProvider: String,
    warrantyExpiry: Date,
    claimNumber: String
  },
  
  // Additional Information
  notes: {
    tenantNotes: String,
    ownerNotes: String,
    technicianNotes: String
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

// Virtual for response time in hours
maintenanceSchema.virtual('responseTimeHours').get(function() {
  if (this.timeline.requestedDate && this.timeline.acknowledgedDate) {
    const diff = this.timeline.acknowledgedDate - this.timeline.requestedDate;
    return Math.round(diff / (1000 * 60 * 60) * 10) / 10;
  }
  return null;
});

// Virtual for resolution time in hours
maintenanceSchema.virtual('resolutionTimeHours').get(function() {
  if (this.timeline.requestedDate && this.timeline.completedDate) {
    const diff = this.timeline.completedDate - this.timeline.requestedDate;
    return Math.round(diff / (1000 * 60 * 60) * 10) / 10;
  }
  return null;
});

// Virtual for days since request
maintenanceSchema.virtual('daysSinceRequest').get(function() {
  const today = new Date();
  const requestDate = new Date(this.timeline.requestedDate);
  const diffTime = today - requestDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for priority color
maintenanceSchema.virtual('priorityColor').get(function() {
  const colors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
    emergency: '#DC2626'
  };
  return colors[this.priority] || '#6B7280';
});

// Pre-save middleware to update timestamps
maintenanceSchema.pre('save', function(next) {
  // Update status timestamps
  if (this.isModified('status')) {
    const now = new Date();
    switch (this.status) {
      case 'acknowledged':
        if (!this.timeline.acknowledgedDate) {
          this.timeline.acknowledgedDate = now;
        }
        break;
      case 'in-progress':
        if (!this.timeline.startedDate) {
          this.timeline.startedDate = now;
        }
        break;
      case 'completed':
        if (!this.timeline.completedDate) {
          this.timeline.completedDate = now;
        }
        break;
    }
  }
  
  // Set emergency flag based on priority
  if (this.priority === 'emergency') {
    this.isEmergency = true;
    if (!this.emergencyDetails.reportedTime) {
      this.emergencyDetails.reportedTime = this.timeline.requestedDate;
    }
  }
  
  this.updatedAt = Date.now();
  next();
});

// Static method to find by status
maintenanceSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

// Static method to find emergency requests
maintenanceSchema.statics.findEmergency = function() {
  return this.find({ isEmergency: true, status: { $ne: 'completed' } });
};

// Static method to find overdue requests
maintenanceSchema.statics.findOverdue = function(days = 7) {
  const overdueDate = new Date();
  overdueDate.setDate(overdueDate.getDate() - days);
  
  return this.find({
    status: { $in: ['pending', 'acknowledged', 'in-progress'] },
    'timeline.requestedDate': { $lte: overdueDate }
  });
};

// Method to add update
maintenanceSchema.methods.addUpdate = function(userId, message, status, images = []) {
  this.updates.push({
    updatedBy: userId,
    message,
    status,
    images,
    timestamp: new Date()
  });
  
  if (status) {
    this.status = status;
  }
  
  return this.save();
};

// Indexes for better query performance
maintenanceSchema.index({ property: 1 });
maintenanceSchema.index({ tenant: 1 });
maintenanceSchema.index({ owner: 1 });
maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ priority: 1 });
maintenanceSchema.index({ category: 1 });
maintenanceSchema.index({ isEmergency: 1 });
maintenanceSchema.index({ 'timeline.requestedDate': -1 });
maintenanceSchema.index({ createdAt: -1 });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;