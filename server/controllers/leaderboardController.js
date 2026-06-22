const User = require('../models/User');
const Badge = require('../models/Badge');

const getLeaderboard = async (req, res) => {
  try {
    const { type = 'points', limit = 10 } = req.query;

    let sortField = {};
    if (type === 'points') sortField = { loyaltyPoints: -1 };
    else if (type === 'spins') sortField = { totalSpins: -1 };
    else if (type === 'streak') sortField = { currentStreak: -1 };
    else sortField = { loyaltyPoints: -1 };

    const users = await User.find({ isAdmin: { $ne: true } })
      .select('name email loyaltyPoints totalSpins currentStreak badges')
      .sort(sortField)
      .limit(parseInt(limit));

    const leaderboard = await Promise.all(users.map(async (user, index) => ({
      rank: index + 1,
      _id: user._id,
      name: user.name,
      email: user.email,
      loyaltyPoints: user.loyaltyPoints,
      totalSpins: user.totalSpins,
      currentStreak: user.currentStreak,
      badgesCount: user.badges?.length || 0
    })));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard };
