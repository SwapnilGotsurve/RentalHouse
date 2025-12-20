import express from 'express';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import { verifyToken, authorize, checkOwnership } from '../middleware/auth.js';
import { validatePaymentCreation, validateObjectIdParam } from '../middleware/validation.js';
import { uploadSingle } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// @desc    Create payment
// @route   POST /api/payments
// @access  Private/Owner/Admin
router.post('/',
  authorize('owner', 'admin'),
  validatePaymentCreation,
  asyncHandler(async (req, res) => {
    const {
      booking: bookingId,
      paymentType,
      amount,
      paymentMethod,
      dueDate,
      paymentPeriod,
      breakdown,
      notes
    } = req.body;
    
    // Verify booking exists
    const booking = await Booking.findById(bookingId)
      .populate('property')
      .populate('tenant')
      .populate('owner');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Only booking owner or admin can create payments
    if (!req.user._id.equals(booking.owner._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only property owner or admin can create payments'
      });
    }
    
    // Prepare payment data
    const paymentData = {
      booking: bookingId,
      property: booking.property._id,
      tenant: booking.tenant._id,
      owner: booking.owner._id,
      paymentType,
      amount,
      paymentMethod,
      dueDate: new Date(dueDate),
      paymentPeriod: paymentPeriod || {},
      breakdown: breakdown || [],
      notes: {
        ownerNotes: notes || ''
      }
    };
    
    const payment = await Payment.create(paymentData);
    
    await payment.populate([
      { path: 'booking', select: 'leaseDetails financialTerms' },
      { path: 'property', select: 'title location' },
      { path: 'tenant', select: 'firstName lastName email phone' },
      { path: 'owner', select: 'firstName lastName email phone' }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: {
        payment
      }
    });
  })
);

// @desc    Get all payments (with filters)
// @route   GET /api/payments
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const { status, paymentType, property, booking, month, year } = req.query;
  
  // Build query based on user role
  let query = {};
  
  if (req.user.role === 'tenant') {
    query.tenant = req.user._id;
  } else if (req.user.role === 'owner') {
    query.owner = req.user._id;
  }
  // Admin can see all payments
  
  if (status) {
    query.status = status;
  }
  
  if (paymentType) {
    query.paymentType = paymentType;
  }
  
  if (property) {
    query.property = property;
  }
  
  if (booking) {
    query.booking = booking;
  }
  
  if (month && year) {
    query['paymentPeriod.month'] = parseInt(month);
    query['paymentPeriod.year'] = parseInt(year);
  }
  
  const payments = await Payment.find(query)
    .populate('booking', 'leaseDetails')
    .populate('property', 'title location')
    .populate('tenant', 'firstName lastName email phone profileImage')
    .populate('owner', 'firstName lastName email phone profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Payment.countDocuments(query);
  
  res.status(200).json({
    success: true,
    data: {
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
router.get('/:id',
  validateObjectIdParam('id'),
  checkOwnership('Payment'),
  asyncHandler(async (req, res) => {
    const payment = req.resource;
    
    await payment.populate([
      { path: 'booking', select: 'leaseDetails financialTerms' },
      { path: 'property', select: 'title location' },
      { path: 'tenant', select: 'firstName lastName email phone profileImage address' },
      { path: 'owner', select: 'firstName lastName email phone profileImage' }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        payment
      }
    });
  })
);

// @desc    Update payment status
// @route   PATCH /api/payments/:id/status
// @access  Private
router.patch('/:id/status',
  validateObjectIdParam('id'),
  checkOwnership('Payment'),
  uploadSingle('receipt'),
  asyncHandler(async (req, res) => {
    const payment = req.resource;
    const { status, transactionId, gatewayPaymentId, notes } = req.body;
    
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }
    
    // Status transition validation
    const currentStatus = payment.status;
    const validTransitions = {
      pending: ['processing', 'completed', 'cancelled'],
      processing: ['completed', 'failed', 'cancelled'],
      completed: ['refunded', 'partially-refunded'],
      failed: ['pending', 'cancelled'],
      cancelled: []
    };
    
    if (!validTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${currentStatus} to ${status}`
      });
    }
    
    payment.status = status;
    
    // Update gateway information
    if (transactionId) {
      payment.gateway.transactionId = transactionId;
    }
    
    if (gatewayPaymentId) {
      payment.gateway.gatewayPaymentId = gatewayPaymentId;
    }
    
    // Add receipt if uploaded
    if (req.file) {
      payment.receipt.receiptUrl = req.file.url;
      payment.receipt.generatedAt = new Date();
    }
    
    // Add notes
    if (notes) {
      if (req.user._id.equals(payment.tenant)) {
        payment.notes.tenantNotes = notes;
      } else if (req.user._id.equals(payment.owner)) {
        payment.notes.ownerNotes = notes;
      } else if (req.user.role === 'admin') {
        payment.notes.adminNotes = notes;
      }
    }
    
    await payment.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: {
        payment: {
          _id: payment._id,
          status: payment.status,
          paidDate: payment.paidDate,
          gateway: payment.gateway
        }
      }
    });
  })
);

// @desc    Process refund
// @route   POST /api/payments/:id/refund
// @access  Private/Owner/Admin
router.post('/:id/refund',
  validateObjectIdParam('id'),
  checkOwnership('Payment'),
  asyncHandler(async (req, res) => {
    const payment = req.resource;
    const { refundAmount, reason } = req.body;
    
    // Only owner or admin can process refunds
    if (!req.user._id.equals(payment.owner) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only property owner or admin can process refunds'
      });
    }
    
    // Can only refund completed payments
    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund completed payments'
      });
    }
    
    if (!refundAmount || refundAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid refund amount is required'
      });
    }
    
    if (refundAmount > payment.amount) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount cannot exceed payment amount'
      });
    }
    
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Refund reason is required'
      });
    }
    
    await payment.processRefund(refundAmount, reason.trim());
    
    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        payment: {
          _id: payment._id,
          status: payment.status,
          refund: payment.refund
        }
      }
    });
  })
);

// @desc    Add payment reminder
// @route   POST /api/payments/:id/reminder
// @access  Private/Owner/Admin
router.post('/:id/reminder',
  validateObjectIdParam('id'),
  checkOwnership('Payment'),
  asyncHandler(async (req, res) => {
    const payment = req.resource;
    const { reminderType } = req.body;
    
    // Only owner or admin can send reminders
    if (!req.user._id.equals(payment.owner) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only property owner or admin can send reminders'
      });
    }
    
    // Can only send reminders for pending payments
    if (payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only send reminders for pending payments'
      });
    }
    
    const validReminderTypes = ['email', 'sms', 'push', 'call'];
    
    if (!reminderType || !validReminderTypes.includes(reminderType)) {
      return res.status(400).json({
        success: false,
        message: 'Valid reminder type is required'
      });
    }
    
    await payment.addReminder(reminderType);
    
    res.status(200).json({
      success: true,
      message: 'Reminder sent successfully',
      data: {
        reminder: payment.reminders[payment.reminders.length - 1]
      }
    });
  })
);

// @desc    Get overdue payments
// @route   GET /api/payments/overdue
// @access  Private
router.get('/overdue', asyncHandler(async (req, res) => {
  let overduePayments = await Payment.findOverdue();
  
  // Filter by user role
  if (req.user.role === 'tenant') {
    overduePayments = overduePayments.filter(payment => 
      payment.tenant.equals(req.user._id)
    );
  } else if (req.user.role === 'owner') {
    overduePayments = overduePayments.filter(payment => 
      payment.owner.equals(req.user._id)
    );
  }
  
  await Payment.populate(overduePayments, [
    { path: 'property', select: 'title location' },
    { path: 'tenant', select: 'firstName lastName email phone' },
    { path: 'owner', select: 'firstName lastName email phone' }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      overduePayments
    }
  });
}));

// @desc    Get payments by period
// @route   GET /api/payments/period/:month/:year
// @access  Private
router.get('/period/:month/:year',
  asyncHandler(async (req, res) => {
    const month = parseInt(req.params.month);
    const year = parseInt(req.params.year);
    
    if (month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: 'Month must be between 1 and 12'
      });
    }
    
    if (year < 2020 || year > 2030) {
      return res.status(400).json({
        success: false,
        message: 'Year must be between 2020 and 2030'
      });
    }
    
    let query = {
      'paymentPeriod.month': month,
      'paymentPeriod.year': year
    };
    
    // Filter by user role
    if (req.user.role === 'tenant') {
      query.tenant = req.user._id;
    } else if (req.user.role === 'owner') {
      query.owner = req.user._id;
    }
    
    const payments = await Payment.find(query)
      .populate('property', 'title location')
      .populate('tenant', 'firstName lastName')
      .populate('owner', 'firstName lastName')
      .sort({ dueDate: 1 });
    
    res.status(200).json({
      success: true,
      data: {
        payments,
        period: { month, year }
      }
    });
  })
);

// @desc    Get payment statistics
// @route   GET /api/payments/stats/overview
// @access  Private
router.get('/stats/overview', asyncHandler(async (req, res) => {
  let matchQuery = {};
  
  // Filter by user role
  if (req.user.role === 'tenant') {
    matchQuery.tenant = req.user._id;
  } else if (req.user.role === 'owner') {
    matchQuery.owner = req.user._id;
  }
  
  const stats = await Payment.getPaymentStats(matchQuery);
  
  // Get payments by type
  const paymentsByType = await Payment.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$paymentType',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);
  
  // Get payments by status
  const paymentsByStatus = await Payment.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);
  
  // Monthly payment trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const monthlyTrend = await Payment.aggregate([
    {
      $match: {
        ...matchQuery,
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        completedAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] }
        }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      overview: stats,
      paymentsByType: paymentsByType.reduce((acc, item) => {
        acc[item._id] = {
          count: item.count,
          totalAmount: item.totalAmount
        };
        return acc;
      }, {}),
      paymentsByStatus: paymentsByStatus.reduce((acc, item) => {
        acc[item._id] = {
          count: item.count,
          totalAmount: item.totalAmount
        };
        return acc;
      }, {}),
      monthlyTrend
    }
  });
}));

// @desc    Generate payment receipt
// @route   GET /api/payments/:id/receipt
// @access  Private
router.get('/:id/receipt',
  validateObjectIdParam('id'),
  checkOwnership('Payment'),
  asyncHandler(async (req, res) => {
    const payment = req.resource;
    
    // Can only generate receipt for completed payments
    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only generate receipt for completed payments'
      });
    }
    
    await payment.populate([
      { path: 'booking', select: 'leaseDetails' },
      { path: 'property', select: 'title location' },
      { path: 'tenant', select: 'firstName lastName email phone address' },
      { path: 'owner', select: 'firstName lastName email phone' }
    ]);
    
    // Generate receipt number if not exists
    if (!payment.receipt.receiptNumber) {
      payment.receipt.receiptNumber = `RCP-${payment.paymentId}`;
      payment.receipt.generatedAt = new Date();
      await payment.save();
    }
    
    // In a real application, you would generate a PDF receipt here
    // For now, we'll return the payment data formatted for receipt
    const receiptData = {
      receiptNumber: payment.receipt.receiptNumber,
      paymentId: payment.paymentId,
      generatedAt: payment.receipt.generatedAt,
      payment: {
        amount: payment.amount,
        paymentType: payment.paymentType,
        paymentMethod: payment.paymentMethod,
        paidDate: payment.paidDate,
        dueDate: payment.dueDate,
        breakdown: payment.breakdown,
        taxes: payment.taxes
      },
      property: payment.property,
      tenant: payment.tenant,
      owner: payment.owner,
      booking: payment.booking
    };
    
    res.status(200).json({
      success: true,
      data: {
        receipt: receiptData
      }
    });
  })
);

// @desc    Update payment method details
// @route   PUT /api/payments/:id/payment-method
// @access  Private
router.put('/:id/payment-method',
  validateObjectIdParam('id'),
  checkOwnership('Payment'),
  asyncHandler(async (req, res) => {
    const payment = req.resource;
    const { bankDetails, chequeDetails } = req.body;
    
    // Only tenant can update payment method details for their payments
    if (!req.user._id.equals(payment.tenant)) {
      return res.status(403).json({
        success: false,
        message: 'Only the tenant can update payment method details'
      });
    }
    
    // Can only update pending payments
    if (payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only update payment method for pending payments'
      });
    }
    
    if (bankDetails) {
      payment.bankDetails = { ...payment.bankDetails, ...bankDetails };
    }
    
    if (chequeDetails) {
      payment.chequeDetails = { ...payment.chequeDetails, ...chequeDetails };
    }
    
    await payment.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment method details updated successfully',
      data: {
        payment: {
          _id: payment._id,
          bankDetails: payment.bankDetails,
          chequeDetails: payment.chequeDetails
        }
      }
    });
  })
);

export default router;