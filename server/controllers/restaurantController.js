const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');

const getRestaurants = async (req, res) => {
  try {
    const { location, rating, price, veg, search, sortBy, page = 1, limit = 12 } = req.query;

    let query = {};

    if (location) query.location = { $regex: location, $options: 'i' };

    if (rating) query.rating = { $gte: parseFloat(rating) };

    if (veg === 'true') query.vegOnly = true;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisines: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { rating: -1 };
    if (sortBy === 'rating') sortOption = { rating: -1 };
    else if (sortBy === 'deliveryTime') sortOption = { deliveryTime: 1 };
    else if (sortBy === 'minOrder') sortOption = { minOrder: 1 };
    else if (sortBy === 'name') sortOption = { name: 1 };

    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOption);

    const total = await Restaurant.countDocuments(query);

    res.json({
      restaurants,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantMenu = async (req, res) => {
  try {
    const menu = await Menu.find({ restaurantId: req.params.id });

    res.json(menu || []);
  } catch (error) {
    console.error("Menu Fetch Error:", error.message);
    res.status(500).json({ message: "Error fetching menu items" });
  }
};

const getAllMenuItems = async (req, res) => {
  try {
    const { category, veg, minPrice, maxPrice, search } = req.query;

    let query = { available: true };

    if (category) {
      query.category = category;
    }

    if (veg === 'true') {
      query.veg = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const menu = await Menu.find(query)
      .populate('restaurantId', 'name location rating')
      .sort({ popularity: -1 });

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPopularDishes = async (req, res) => {
  try {
    const dishes = await Menu.find({ available: true })
      .populate('restaurantId', 'name location')
      .sort({ popularity: -1 })
      .limit(20);

    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  getAllMenuItems,
  getPopularDishes
};
