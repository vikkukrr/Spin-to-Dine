const User = require('../models/User');
const Badge = require('../models/Badge');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../utils/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, address, budgetRange, location } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered. Please login instead.' });
    }

    const user = await User.create({
      name, email, password,
      address: address || '',
      budgetRange: budgetRange || 'medium',
      location: location || 'default'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        budgetRange: user.budgetRange,
        location: user.location,
        isAdmin: user.isAdmin,
        loyaltyPoints: user.loyaltyPoints,
        currentStreak: user.currentStreak,
        totalSpins: user.totalSpins,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      budgetRange: user.budgetRange,
      location: user.location,
      isAdmin: user.isAdmin,
      loyaltyPoints: user.loyaltyPoints,
      currentStreak: user.currentStreak,
      totalSpins: user.totalSpins,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('badges')
      .populate('orderHistory');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      budgetRange: user.budgetRange,
      location: user.location,
      isAdmin: user.isAdmin,
      loyaltyPoints: user.loyaltyPoints,
      totalSpins: user.totalSpins,
      currentStreak: user.currentStreak,
      badges: user.badges,
      orderHistory: user.orderHistory,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, address, budgetRange, location } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address !== undefined ? address : user.address;
    user.budgetRange = budgetRange || user.budgetRange;
    user.location = location || user.location;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      budgetRange: updatedUser.budgetRange,
      location: updatedUser.location,
      isAdmin: updatedUser.isAdmin,
      loyaltyPoints: updatedUser.loyaltyPoints,
      currentStreak: updatedUser.currentStreak,
      totalSpins: updatedUser.totalSpins,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset - Spin-to-Dine',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="padding:10px 20px;background:#FF6B35;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>Link expires in 30 minutes.</p>
        <p>If you didn't request this, ignore this email.</p>
      `
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const allBadges = await Badge.find();
    const earnedBadgeIds = user.badges.map(b => b.toString());

    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge._id.toString())) continue;

      let earned = false;
      switch (badge.criteria.type) {
        case 'spin_count':
          earned = user.totalSpins >= badge.criteria.threshold;
          break;
        case 'streak_days':
          earned = user.currentStreak >= badge.criteria.threshold;
          break;
        case 'points_earned':
          earned = user.loyaltyPoints >= badge.criteria.threshold;
          break;
        case 'order_count':
          earned = user.orderHistory.length >= badge.criteria.threshold;
          break;
      }

      if (earned) {
        user.badges.push(badge._id);
      }
    }

    await user.save();
  } catch (error) {
    console.error('Error checking badges:', error);
  }
};

module.exports = {
  registerUser, loginUser, getUserProfile, updateUserProfile,
  changePassword, forgotPassword, resetPassword, checkAndAwardBadges
};
