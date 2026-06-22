const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(200).json({
        message: 'Google login not configured. Set GOOGLE_CLIENT_ID in .env'
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: googleId + '_' + process.env.JWT_SECRET,
        location: 'default'
      });
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
});

module.exports = router;
