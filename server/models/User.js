const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  address: { type: String, default: '' },
  budgetRange: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  location: { type: String, default: 'default' },
  isAdmin: { type: Boolean, default: false },
  loyaltyPoints: { type: Number, default: 0 },
  totalSpins: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  lastSpinDate: { type: Date, default: null },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  savedRecipes: [{ type: mongoose.Schema.Types.Mixed }],
  createdAt: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);