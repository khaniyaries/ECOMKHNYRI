import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  cardHolder: {
    type: String,
    required: true
  },
  expiry: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Visa', 'MasterCard', 'American Express', 'Rupay']
  }
}, { timestamps: true });

export default mongoose.model('PaymentMethod', paymentMethodSchema);
