import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

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
    sparse: true  // Allows null but maintains uniqueness
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
  }
}, { timestamps: true });

// Add pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

export const User = mongoose.model('users', userSchema);
