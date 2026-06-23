const Menu = require('../models/Menu');
const User = require('../models/User');
const Order = require('../models/Order');
const GamificationLog = require('../models/GamificationLog');
const { generateSmartSuggestions } = require('../utils/recommendationEngine');
const { checkAndAwardBadges } = require('./authController');

const getSuggestions = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySpins = await GamificationLog.countDocuments({
      userId,
      spinDate: { $gte: today }
    });

    if (todaySpins >= 3) {
      return res.status(400).json({
        message: 'Maximum spins reached for today',
        spinsRemaining: 0,
        nextReset: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      });
    }

    const suggestions = await generateSmartSuggestions(userId);

    const user = await User.findById(userId);

    res.json({
      suggestions,
      spinsRemaining: 3 - todaySpins,
      todaySpinCount: todaySpins,
      currentStreak: user?.currentStreak || 0,
      loyaltyPoints: user?.loyaltyPoints || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logSpin = async (req, res) => {
  try {
    const { menuItemId, restaurantId, accepted, score, timeSlot } = req.body;
    const userId = req.user._id;

    if (!menuItemId || !restaurantId) {
      return res.status(400).json({ message: 'Menu item and restaurant are required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySpins = await GamificationLog.countDocuments({
      userId,
      spinDate: { $gte: today }
    });

    if (todaySpins >= 3) {
      return res.status(400).json({ message: 'Maximum spins reached for today' });
    }

    const log = await GamificationLog.create({
      userId,
      suggestedDish: menuItemId,
      restaurantId,
      accepted: accepted || false,
      timeSlot: timeSlot || getTimeSlot(),
      score: score || 0
    });

    const user = await User.findById(userId);
    user.totalSpins += 1;
    user.loyaltyPoints += 10;

    const lastSpin = user.lastSpinDate;
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (!lastSpin) {
      user.currentStreak = 1;
    } else {
      const lastSpinDay = new Date(lastSpin);
      lastSpinDay.setHours(0, 0, 0, 0);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      if (lastSpinDay.getTime() === todayStart.getTime()) {
      } else if (lastSpinDay.getTime() === yesterday.getTime()) {
        user.currentStreak += 1;
        if (user.currentStreak >= 3) {
          user.loyaltyPoints += 5;
        }
      } else {
        user.currentStreak = 1;
      }
    }

    user.lastSpinDate = now;
    await user.save();

    await checkAndAwardBadges(userId);

    const bonusPoints = (user.currentStreak >= 3 && lastSpin) ? 5 : 0;

    res.status(201).json({
      message: accepted ? 'Dish added to order' : 'Spin logged',
      log,
      loyaltyPoints: user.loyaltyPoints,
      currentStreak: user.currentStreak,
      totalSpins: user.totalSpins,
      pointsEarned: 10 + bonusPoints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSpinHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const history = await GamificationLog.find({ userId })
      .populate('suggestedDish', 'name price imageUrl')
      .populate('restaurantId', 'name location')
      .sort({ spinDate: -1 })
      .limit(20);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptSpinLog = async (req, res) => {
  try {
    const { logId } = req.params;

    const log = await GamificationLog.findById(logId);
    if (!log) {
      return res.status(404).json({ message: 'Spin log not found' });
    }

    if (log.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    log.accepted = true;
    await log.save();

    res.json({ message: 'Spin accepted', log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTimeSlot = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 21) return 'dinner';
  return 'snacks';
};

module.exports = {
  getSuggestions, logSpin, getSpinHistory, acceptSpinLog
};
