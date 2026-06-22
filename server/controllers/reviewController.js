const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

const createReview = async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;
    
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const existing = await Review.findOne({ userId: req.user._id, restaurantId });
    if (existing) return res.status(400).json({ message: 'Already reviewed this restaurant' });

    const review = await Review.create({
      userId: req.user._id,
      restaurantId,
      rating,
      comment
    });

    const reviews = await Review.find({ restaurantId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    restaurant.rating = Math.round(avgRating * 10) / 10;
    restaurant.ratingCount = reviews.length;
    await restaurant.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { restaurantId } = review;
    await Review.findByIdAndDelete(req.params.id);

    const reviews = await Review.find({ restaurantId });
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
      restaurant.rating = reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : 0;
      restaurant.ratingCount = reviews.length;
      await restaurant.save();
    }

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getReviews, deleteReview };
