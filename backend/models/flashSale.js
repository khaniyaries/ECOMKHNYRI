import mongoose from 'mongoose';

const flashSaleSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products'
    },
    flashSalePrice: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('FlashSale', flashSaleSchema);