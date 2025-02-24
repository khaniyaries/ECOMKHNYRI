import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products'
  }]
}, { timestamps: true });

export default mongoose.model('Wishlist', wishlistSchema);
