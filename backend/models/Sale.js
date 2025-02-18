import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: true
  }
});

export default mongoose.model('sales', saleSchema);
