import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', 
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    url: String,
    public_id: String
  }],
  adminResponse: {
    comment: String,
    respondedAt: Date
  },
  verified: {
    type: Boolean,
    default: false
  },
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
  flashSalePrice: {
    type: Number,
    min: 0
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
