import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  
  // Rating
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  // Detailed Ratings
  detailedRatings: {
    cleanliness: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    location: {
      type: Number,
      min: 1,
      max: 5
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5
    },
    maintenance: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Related Entities
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer is required']
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewee is required'] // Property owner
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  
  // Review Type
  reviewType: {
    type: String,
    enum: ['property', 'owner', 'tenant'],
    required: [true, 'Review type is required']
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'hidden'],
    default: 'pending'
  },
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDetails: {
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    verificationMethod: {
      type: String,
      enum: ['booking-verified', 'admin-verified', 'auto-verified']
    }
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
  
  // Helpful Votes
  helpfulVotes: {
    helpful: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }],
    notHelpful: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Response from Owner/Property Manager
  response: {
    comment: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  
  // Moderation
  moderationFlags: [{
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['inappropriate', 'spam', 'fake', 'offensive', 'other']
    },
    description: String,
    flaggedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Review Context
  stayDuration: {
    type: Number, // in months
    min: 0
  },
  recommendToOthers: {
    type: Boolean
  },
  wouldRentAgain: {
    type: Boolean
  },
  
  // Anonymous Review Option
  isAnonymous: {
    type: Boolean,
    default: false
  },
  
  // Featured Review
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredAt: Date,
  
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

// Virtual for helpful score
reviewSchema.virtual('helpfulScore').get(function() {
  const helpful = this.helpfulVotes.helpful.length;
  const notHelpful = this.helpfulVotes.notHelpful.length;
  const total = helpful + notHelpful;
  
  if (total === 0) return 0;
  return Math.round((helpful / total) * 100);
});

// Virtual for average detailed rating
reviewSchema.virtual('averageDetailedRating').get(function() {
  const ratings = this.detailedRatings;
  const values = Object.values(ratings).filter(val => val != null);
  
  if (values.length === 0) return this.rating;
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / values.length) * 10) / 10;
});

// Virtual for review age in days
reviewSchema.virtual('reviewAge').get(function() {
  const today = new Date();
  const reviewDate = new Date(this.createdAt);
  const diffTime = today - reviewDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for display name (considering anonymous option)
reviewSchema.virtual('displayName').get(function() {
  if (this.isAnonymous) {
    return 'Anonymous User';
  }
  // This will be populated from the reviewer reference
  return this.reviewer ? this.reviewer.fullName : 'Unknown User';
});

// Pre-save middleware to auto-verify reviews from confirmed bookings
reviewSchema.pre('save', async function(next) {
  if (this.isNew && this.booking) {
    try {
      const Booking = mongoose.model('Booking');
      const booking = await Booking.findById(this.booking);
      
      if (booking && booking.status === 'completed') {
        this.isVerified = true;
        this.verificationDetails = {
          verifiedAt: new Date(),
          verificationMethod: 'booking-verified'
        };
        this.status = 'approved';
      }
    } catch (error) {
      console.error('Error verifying review:', error);
    }
  }
  
  this.updatedAt = Date.now();
  next();
});

// Static method to find approved reviews
reviewSchema.statics.findApproved = function() {
  return this.find({ status: 'approved' });
};

// Static method to find featured reviews
reviewSchema.statics.findFeatured = function() {
  return this.find({ 
    status: 'approved', 
    isFeatured: true 
  }).sort({ featuredAt: -1 });
};

// Static method to get property average rating
reviewSchema.statics.getPropertyAverageRating = async function(propertyId) {
  const result = await this.aggregate([
    {
      $match: {
        property: mongoose.Types.ObjectId(propertyId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);
  
  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0, ratingDistribution: [] };
  }
  
  const data = result[0];
  
  // Calculate rating distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  data.ratingDistribution.forEach(rating => {
    distribution[rating] = (distribution[rating] || 0) + 1;
  });
  
  return {
    averageRating: Math.round(data.averageRating * 10) / 10,
    totalReviews: data.totalReviews,
    ratingDistribution: distribution
  };
};

// Method to add helpful vote
reviewSchema.methods.addHelpfulVote = function(userId, isHelpful) {
  // Remove any existing vote from this user
  this.helpfulVotes.helpful = this.helpfulVotes.helpful.filter(
    vote => !vote.user.equals(userId)
  );
  this.helpfulVotes.notHelpful = this.helpfulVotes.notHelpful.filter(
    vote => !vote.user.equals(userId)
  );
  
  // Add new vote
  if (isHelpful) {
    this.helpfulVotes.helpful.push({ user: userId });
  } else {
    this.helpfulVotes.notHelpful.push({ user: userId });
  }
  
  return this.save();
};

// Method to add response
reviewSchema.methods.addResponse = function(userId, comment) {
  this.response = {
    comment,
    respondedBy: userId,
    respondedAt: new Date()
  };
  
  return this.save();
};

// Indexes for better query performance
reviewSchema.index({ property: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isFeatured: 1 });
reviewSchema.index({ isVerified: 1 });
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;