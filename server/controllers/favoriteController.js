const Favorite = require('../models/Favorite');

const addFavorite = async (req, res) => {
  try {
    const { restaurantId } = req.body;
    const existing = await Favorite.findOne({ userId: req.user._id, restaurantId });
    if (existing) return res.status(400).json({ message: 'Already in favorites' });

    const favorite = await Favorite.create({ userId: req.user._id, restaurantId });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      userId: req.user._id,
      restaurantId: req.params.restaurantId
    });
    if (!favorite) return res.status(404).json({ message: 'Favorite not found' });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate('restaurantId')
      .sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      userId: req.user._id,
      restaurantId: req.params.restaurantId
    });
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites, checkFavorite };
