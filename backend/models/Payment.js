import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  // Basic Information
  paymentId: {
    type: String,
    unique: true,
    required: [true, 'Payment ID is required']
  },
  
  // Related Entities
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking is required']
  },
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
  
  // Payment Details
  paymentType: {
    type: String,
    required: [true, 'Payment type is required'],
    enum: [
      'security-deposit', 'monthly-rent', 'maintenance-charges', 
      'late-fee', 'utility-bill', 'damage-charge', 'refund', 'other'
    ]
  },
  
  // Amount Information
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['bank-transfer', 'credit-card', 'debit-card', 'upi', 'cash', 'cheque', 'online-banking']
  },
  
  // Payment Gateway Information
  gateway: {
    provider: {
      type: String,
      enum: ['razorpay', 'stripe', 'payu', 'cashfree', 'manual']
    },
    transactionId: String,
    gatewayPaymentId: String,
    gatewayOrderId: String
  },
  
  // Status
  status: {
    type: String,
    required: [true, 'Payment status is required'],
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially-refunded'],
    default: 'pending'
  },
  
  // Payment Period (for rent payments)
  paymentPeriod: {
    month: {
      type: Number,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      min: 2020
    },
    startDate: Date,
    endDate: Date
  },
  
  // Due Date Information
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  paidDate: Date,
  
  // Late Payment
  isLatePayment: {
    type: Boolean,
    default: false
  },
  lateFee: {
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  daysLate: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Receipt Information
  receipt: {
    receiptNumber: String,
    receiptUrl: String,
    generatedAt: Date
  },
  
  // Bank Details (for bank transfers)
  bankDetails: {
    accountNumber: String,
    routingNumber: String,
    bankName: String,
    accountHolderName: String,
    referenceNumber: String
  },
  
  // Cheque Details (for cheque payments)
  chequeDetails: {
    chequeNumber: String,
    bankName: String,
    chequeDate: Date,
    clearanceDate: Date,
    isCleared: {
      type: Boolean,
      default: false
    }
  },
  
  // Refund Information
  refund: {
    refundAmount: {
      type: Number,
      min: 0
    },
    refundReason: String,
    refundDate: Date,
    refundMethod: String,
    refundTransactionId: String,
    refundStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed']
    }
  },
  
  // Payment Breakdown
  breakdown: [{
    description: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: ['rent', 'deposit', 'maintenance', 'utility', 'fee', 'tax', 'other']
    }
  }],
  
  // Taxes and Fees
  taxes: {
    gst: {
      rate: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }
    },
    serviceTax: {
      rate: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }
    },
    processingFee: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Notes and Comments
  notes: {
    tenantNotes: String,
    ownerNotes: String,
    adminNotes: String,
    paymentNotes: String
  },
  
  // Reminders
  reminders: [{
    sentDate: {
      type: Date,
      required: true
    },
    reminderType: {
      type: String,
      enum: ['email', 'sms', 'push', 'call'],
      required: true
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent'
    }
  }],
  
  // Recurring Payment Information
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringDetails: {
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'semi-annually', 'annually']
    },
    nextPaymentDate: Date,
    autoPayEnabled: {
      type: Boolean,
      default: false
    }
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

// Virtual for total amount including taxes and fees
paymentSchema.virtual('totalAmount').get(function() {
  const baseAmount = this.amount;
  const gstAmount = this.taxes.gst.amount || 0;
  const serviceTaxAmount = this.taxes.serviceTax.amount || 0;
  const processingFee = this.taxes.processingFee || 0;
  
  return baseAmount + gstAmount + serviceTaxAmount + processingFee;
});

// Virtual for payment status color
paymentSchema.virtual('statusColor').get(function() {
  const colors = {
    pending: '#F59E0B',
    processing: '#3B82F6',
    completed: '#10B981',
    failed: '#EF4444',
    cancelled: '#6B7280',
    refunded: '#8B5CF6',
    'partially-refunded': '#A855F7'
  };
  return colors[this.status] || '#6B7280';
});

// Virtual for days overdue
paymentSchema.virtual('daysOverdue').get(function() {
  if (this.status === 'completed' || !this.dueDate) return 0;
  
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  
  if (today <= dueDate) return 0;
  
  const diffTime = today - dueDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to generate payment ID
paymentSchema.pre('save', function(next) {
  if (this.isNew && !this.paymentId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.paymentId = `PAY-${timestamp}-${random}`;
  }
  
  // Calculate late payment details
  if (this.dueDate && this.status !== 'completed') {
    const today = new Date();
    const dueDate = new Date(this.dueDate);
    
    if (today > dueDate) {
      this.isLatePayment = true;
      this.daysLate = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      
      // Calculate late fee if percentage is set
      if (this.lateFee.percentage > 0) {
        this.lateFee.amount = (this.amount * this.lateFee.percentage) / 100;
      }
    }
  }
  
  // Set paid date when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.paidDate) {
    this.paidDate = new Date();
  }
  
  this.updatedAt = Date.now();
  next();
});

// Static method to find overdue payments
paymentSchema.statics.findOverdue = function() {
  const today = new Date();
  return this.find({
    status: { $in: ['pending', 'processing'] },
    dueDate: { $lt: today }
  });
};

// Static method to find payments by period
paymentSchema.statics.findByPeriod = function(month, year) {
  return this.find({
    'paymentPeriod.month': month,
    'paymentPeriod.year': year
  });
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = async function(filters = {}) {
  const matchStage = { ...filters };
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalPayments: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        completedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        pendingPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        overduePayments: {
          $sum: { $cond: ['$isLatePayment', 1, 0] }
        },
        averageAmount: { $avg: '$amount' }
      }
    }
  ]);
  
  return stats.length > 0 ? stats[0] : {
    totalPayments: 0,
    totalAmount: 0,
    completedPayments: 0,
    pendingPayments: 0,
    overduePayments: 0,
    averageAmount: 0
  };
};

// Method to process refund
paymentSchema.methods.processRefund = function(refundAmount, reason) {
  this.refund = {
    refundAmount,
    refundReason: reason,
    refundDate: new Date(),
    refundStatus: 'pending'
  };
  
  if (refundAmount >= this.amount) {
    this.status = 'refunded';
  } else {
    this.status = 'partially-refunded';
  }
  
  return this.save();
};

// Method to add reminder
paymentSchema.methods.addReminder = function(reminderType) {
  this.reminders.push({
    sentDate: new Date(),
    reminderType,
    status: 'sent'
  });
  
  return this.save();
};

// Indexes for better query performance
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ property: 1 });
paymentSchema.index({ tenant: 1 });
paymentSchema.index({ owner: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentType: 1 });
paymentSchema.index({ dueDate: 1 });
paymentSchema.index({ paidDate: 1 });
paymentSchema.index({ isLatePayment: 1 });
paymentSchema.index({ 'paymentPeriod.month': 1, 'paymentPeriod.year': 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;