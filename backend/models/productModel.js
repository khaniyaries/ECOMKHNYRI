import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    url: String,
    isPrimary: Boolean
  }],
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
  },
  colors: [{
    type: String
  }],
  sizes: [{
    type: String
  }],
  percentageOff: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isFlashSale: {
    type: Boolean,
    default: false
  },
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('products', productSchema);
