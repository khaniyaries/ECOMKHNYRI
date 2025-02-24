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
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled','returned'],
    default: 'pending'
  },
  cancellationDetails: {
    reason: String,
    date: Date,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'completed'],
      default: 'pending'
    }
  },
  returnDetails: {
    reason: String,
    date: Date,
    status: {
      type: String,
      enum: ['requested', 'approved', 'received', 'refunded'],
      default: 'requested'
    },
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'completed'],
      default: 'pending'
    }
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'card', 'upi', 'netbanking'],
    required: true
  },
  transactionId: {
    type: String,
    sparse: true
  },
  saleDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('sales', saleSchema);
