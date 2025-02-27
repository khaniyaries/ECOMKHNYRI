import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    sparse: true
  },
  phone: {
    type: String,
    sparse: true
  },
  password: {
    type: String,
    required: function() {
        return this.authProvider === 'local'
    }
  },
  photo: {
    type: String
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  }
}, { timestamps: true });

export const User = mongoose.model('users', userSchema);
