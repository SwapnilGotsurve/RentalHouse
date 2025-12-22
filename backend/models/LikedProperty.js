import mongoose from 'mongoose';

const likedPropertySchema = new mongoose.Schema({
  // User who liked the property
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  // Property that was liked
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  
  // Additional information
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
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

// Compound index to ensure a user can only like a property once
likedPropertySchema.index({ user: 1, property: 1 }, { unique: true });

// Indexes for better query performance
likedPropertySchema.index({ user: 1 });
likedPropertySchema.index({ property: 1 });
likedPropertySchema.index({ createdAt: -1 });

// Pre-save middleware to update timestamps
likedPropertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find user's liked properties
likedPropertySchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).populate('property');
};

// Static method to check if user liked a property
likedPropertySchema.statics.isLikedByUser = async function(userId, propertyId) {
  const liked = await this.findOne({ user: userId, property: propertyId });
  return !!liked;
};

// Static method to get property like count
likedPropertySchema.statics.getLikeCount = function(propertyId) {
  return this.countDocuments({ property: propertyId });
};

const LikedProperty = mongoose.model('LikedProperty', likedPropertySchema);

export default LikedProperty;