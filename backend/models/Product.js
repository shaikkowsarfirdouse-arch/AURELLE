import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    categoryName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A product must have at least one image',
      },
    },
    material: {
      type: String,
      required: [true, 'Material specification is required'],
      trim: true,
    },
    purity: {
      type: String,
      default: '18K Gold',
      trim: true,
    },
    weight: {
      type: String,
      required: [true, 'Item weight specification is required'],
      trim: true,
    },
    gemstone: {
      type: String,
      default: 'None',
      trim: true,
    },
    dimensions: {
      type: String,
      default: '',
      trim: true,
    },
    sizes: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Product stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 10,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    ratingsAverage: {
      type: Number,
      default: 5.0,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating cannot exceed 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    certification: {
      type: String,
      default: 'Skin-Friendly & Anti-Tarnish Polished',
    },
    careInstructions: {
      type: String,
      default: 'Keep away from direct perfumes, moisture, and hairsprays. Store separately in a clean ziplock pouch or velvet box after wear to retain long-lasting shine.',
    },
  },
  {
    timestamps: true,
  }
);

// Index for search queries
productSchema.index({ name: 'text', description: 'text', material: 'text', gemstone: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;

