import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, 'Please add a review title'],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment for your review'],
    },
    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting multiple reviews for the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to recalculate average rating of product
reviewSchema.statics.getAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Product').findByIdAndUpdate(productId, {
        ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].numReviews,
      });
    } else {
      await mongoose.model('Product').findByIdAndUpdate(productId, {
        ratingsAverage: 5.0,
        numReviews: 0,
      });
    }
  } catch (err) {
    console.error('Error updating product rating average:', err);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.product);
});

reviewSchema.post('remove', async function () {
  await this.constructor.getAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;

