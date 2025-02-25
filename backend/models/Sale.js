import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  }
});

const saleSchema = new mongoose.Schema({
  orderItems: [orderItemSchema],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  cancellationDetails: {
    reason: String,
    date: Date,
    refundStatus: {
      type: String,
      enum: ['none', 'pending', 'processed', 'completed'],
      default: 'none'
    }
  },
  returnDetails: {
    reason: String,
    date: Date,
    status: {
      type: String,
      enum: ['none', 'requested', 'approved', 'received', 'refunded'],
      default: 'none'
    },
    refundStatus: {
      type: String,
      enum: ['none', 'pending', 'processed', 'completed'],
      default: 'none'
    }
  },
  paymentMode: {
    type: String,
    enum: ['bank', 'cash', 'card', 'upi', 'netbanking'],
    required: true
  },
  transactionId: {
    type: String,
    sparse: true
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "addresses",
    required: true,
  },
  shippingaddress: {
    type: Object,
  },
  saleDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('sales', saleSchema);
