const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For hashing passwords

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, // Normalize email to lowercase
    trim: true 
  },
  password: { 
    type: String, 
    required: false // Only required after signup completes
  },
  otp: { 
    type: String, 
    required: false // Temporary, cleared after verification
  },
  otpExpires: { 
    type: Date, 
    required: false // Temporary, cleared after verification
  },
  isVerified: { 
    type: Boolean, 
    default: false // Tracks if email is verified and signup is complete
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Hash password before saving (only if password is provided)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);