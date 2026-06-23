const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemServer = null;

const seedData = async () => {
  const Restaurant = require('../models/Restaurant');
  const Menu = require('../models/Menu');
  const User = require('../models/User');
  const Badge = require('../models/Badge');

  const existing = await Restaurant.countDocuments();
  if (existing > 0) return;

  const badges = [
    { name: 'First Spin', description: 'Spun the wheel for the first time', icon: '🎰', criteria: { type: 'spin_count', threshold: 1 } },
    { name: 'Spin Master', description: 'Completed 10 spins', icon: '🔄', criteria: { type: 'spin_count', threshold: 10 } },
    { name: 'Spin Legend', description: 'Completed 50 spins', icon: '🏆', criteria: { type: 'spin_count', threshold: 50 } },
    { name: 'On Fire', description: 'Maintained a 3-day streak', icon: '🔥', criteria: { type: 'streak_days', threshold: 3 } },
    { name: 'Unstoppable', description: 'Maintained a 7-day streak', icon: '💪', criteria: { type: 'streak_days', threshold: 7 } },
    { name: 'Point Collector', description: 'Earned 100 loyalty points', icon: '⭐', criteria: { type: 'points_earned', threshold: 100 } },
    { name: 'Big Spender', description: 'Earned 500 loyalty points', icon: '💎', criteria: { type: 'points_earned', threshold: 500 } },
    { name: 'Food Explorer', description: 'Placed first order', icon: '🍽️', criteria: { type: 'order_count', threshold: 1 } },
    { name: 'Regular Customer', description: 'Placed 10 orders', icon: '👑', criteria: { type: 'order_count', threshold: 10 } }
  ];

  await Badge.insertMany(badges);

  const salt = await bcrypt.genSalt(10);
  await User.create({ name: 'Test User', email: 'test@example.com', password: await bcrypt.hash('password123', salt) });
  await User.create({ name: 'Admin', email: 'admin@example.com', password: await bcrypt.hash('admin123', salt), isAdmin: true });

  const restaurants = [
    { name: 'Biryani House', location: 'Downtown', rating: 4.5, ratingCount: 230, cuisines: ['Biryani', 'North Indian', 'Mughlai'], deliveryTime: '30-40 min', deliveryFee: 40, minOrder: 200, vegOnly: false, isOpen: true, imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400' },
    { name: 'Green Leaf Kitchen', location: 'Westside', rating: 4.3, ratingCount: 180, cuisines: ['South Indian', 'Vegetarian', 'Healthy'], deliveryTime: '25-35 min', deliveryFee: 30, minOrder: 150, vegOnly: true, isOpen: true, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
    { name: 'Pizza Paradise', location: 'Central', rating: 4.7, ratingCount: 450, cuisines: ['Pizza', 'Italian', 'Fast Food'], deliveryTime: '20-30 min', deliveryFee: 50, minOrder: 300, vegOnly: false, isOpen: true, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
    { name: 'Spice Garden', location: 'Eastside', rating: 4.2, ratingCount: 150, cuisines: ['Chinese', 'Thai', 'Asian'], deliveryTime: '35-45 min', deliveryFee: 35, minOrder: 200, vegOnly: false, isOpen: true, imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400' },
    { name: 'Southern Spice', location: 'Southtown', rating: 4.4, ratingCount: 200, cuisines: ['South Indian', 'Dosa', 'Idli'], deliveryTime: '25-35 min', deliveryFee: 25, minOrder: 100, vegOnly: false, isOpen: true, imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
    { name: 'Burger Barn', location: 'Central', rating: 4.1, ratingCount: 320, cuisines: ['Burgers', 'American', 'Fast Food'], deliveryTime: '20-30 min', deliveryFee: 40, minOrder: 150, vegOnly: false, isOpen: true, imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400' },
    { name: 'Sushi World', location: 'Central', rating: 4.8, ratingCount: 180, cuisines: ['Japanese', 'Sushi', 'Asian'], deliveryTime: '25-35 min', deliveryFee: 60, minOrder: 350, vegOnly: false, isOpen: true, imageUrl: 'https://images.pexels.com/photos/14469273/pexels-photo-14469273.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop' },
    { name: 'Cafe Coffee Day', location: 'Westside', rating: 4.0, ratingCount: 120, cuisines: ['Cafe', 'Beverages', 'Snacks'], deliveryTime: '15-25 min', deliveryFee: 20, minOrder: 100, vegOnly: false, isOpen: true, imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400' },
    { name: 'Tandoori Nights', location: 'Downtown', rating: 4.6, ratingCount: 290, cuisines: ['North Indian', 'Mughlai', 'Tandoori'], deliveryTime: '30-40 min', deliveryFee: 45, minOrder: 250, vegOnly: false, isOpen: true, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
    { name: 'Dragon Wok', location: 'Eastside', rating: 4.3, ratingCount: 160, cuisines: ['Chinese', 'Thai', 'Noodles'], deliveryTime: '25-35 min', deliveryFee: 35, minOrder: 200, vegOnly: false, isOpen: true, imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=250&fit=crop' },
    { name: 'Sweet Tooth Bakery', location: 'Central', rating: 4.5, ratingCount: 200, cuisines: ['Bakery', 'Desserts', 'Cafe'], deliveryTime: '20-30 min', deliveryFee: 25, minOrder: 150, vegOnly: false, isOpen: true, imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400' },
    { name: 'Dosa Express', location: 'Southtown', rating: 4.2, ratingCount: 140, cuisines: ['South Indian', 'Dosa', 'Fast Food'], deliveryTime: '20-30 min', deliveryFee: 20, minOrder: 80, vegOnly: true, isOpen: true, imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400' },
  ];

  const createdRestaurants = await Restaurant.insertMany(restaurants);

  const menuItems = [
    { name: 'Chicken Dum Biryani', description: 'Aromatic basmati rice cooked with spicy chicken', price: 250, category: 'lunch', veg: false, restaurantIndex: 0, popularity: 150, imageUrl: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?w=400' },
    { name: 'Mutton Biryani', description: 'Tender mutton pieces cooked with fragrant rice', price: 350, category: 'lunch', veg: false, restaurantIndex: 0, popularity: 120, imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400' },
    { name: 'Vegetable Biryani', description: 'Mixed vegetables cooked with basmati rice', price: 180, category: 'lunch', veg: true, restaurantIndex: 0, popularity: 80, imageUrl: 'https://images.pexels.com/photos/1111317/pexels-photo-1111317.jpeg?w=400' },
    { name: 'Chicken 65', description: 'Spicy deep-fried chicken appetizer', price: 200, category: 'snacks', veg: false, restaurantIndex: 0, popularity: 90, imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400' },
    { name: 'Dal Makhani', description: 'Creamy black lentil curry', price: 150, category: 'lunch', veg: true, restaurantIndex: 0, popularity: 70, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
    { name: 'Masala Dosa', description: 'Crispy rice crepe with potato filling', price: 120, category: 'breakfast', veg: true, restaurantIndex: 1, popularity: 200, imageUrl: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?w=400' },
    { name: 'Idli Sambar', description: 'Steamed rice cakes with lentil stew', price: 80, category: 'breakfast', veg: true, restaurantIndex: 1, popularity: 180, imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
    { name: 'Vegetable Uttapam', description: 'Thick pancake with vegetables', price: 140, category: 'breakfast', veg: true, restaurantIndex: 1, popularity: 100, imageUrl: 'https://images.unsplash.com/photo-1630409351241-e90e7f5e434d?w=400' },
    { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 220, category: 'lunch', veg: true, restaurantIndex: 1, popularity: 150, imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400' },
    { name: 'Fresh Fruit Juice', description: 'Seasonal mixed fruit juice', price: 60, category: 'beverages', veg: true, restaurantIndex: 1, popularity: 80, imageUrl: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?w=400' },
    { name: 'Margherita Pizza', description: 'Classic tomato and mozzarella pizza', price: 299, category: 'lunch', veg: true, restaurantIndex: 2, popularity: 250, imageUrl: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?w=400' },
    { name: 'Pepperoni Pizza', description: 'Loaded with pepperoni slices', price: 399, category: 'lunch', veg: false, restaurantIndex: 2, popularity: 220, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
    { name: 'Veggie Supreme', description: 'Loaded with various vegetables', price: 349, category: 'lunch', veg: true, restaurantIndex: 2, popularity: 180, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
    { name: 'Garlic Bread', description: 'Crispy bread with garlic butter', price: 99, category: 'snacks', veg: true, restaurantIndex: 2, popularity: 120, imageUrl: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?w=400' },
    { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 149, category: 'desserts', veg: true, restaurantIndex: 2, popularity: 200, imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400' },
    { name: 'Chicken Fried Rice', description: 'Wok-tossed rice with chicken and vegetables', price: 200, category: 'lunch', veg: false, restaurantIndex: 3, popularity: 170, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
    { name: 'Vegetable Noodles', description: 'Stir-fried noodles with vegetables', price: 150, category: 'lunch', veg: true, restaurantIndex: 3, popularity: 140, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
    { name: 'Spring Rolls', description: 'Crispy vegetable rolls', price: 120, category: 'snacks', veg: true, restaurantIndex: 3, popularity: 100, imageUrl: 'https://images.unsplash.com/photo-1606331191459-420dc2fa5d3d?w=400' },
    { name: 'Manchurian', description: 'Fried balls in spicy sauce', price: 180, category: 'snacks', veg: true, restaurantIndex: 3, popularity: 160, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
    { name: 'Chicken Chettinad', description: 'Spicy chicken curry with Chettinad spices', price: 280, category: 'lunch', veg: false, restaurantIndex: 4, popularity: 130, imageUrl: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?w=400' },
    { name: 'Fish Fry', description: 'Crispy fried fish with spices', price: 250, category: 'lunch', veg: false, restaurantIndex: 4, popularity: 110, imageUrl: 'https://images.unsplash.com/photo-1598514983318-29142275b1d4?w=400' },
    { name: 'Pongal', description: 'Rice and lentil dish with pepper', price: 100, category: 'breakfast', veg: true, restaurantIndex: 4, popularity: 90, imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
    { name: 'Chicken 65', description: 'Spicy fried chicken', price: 180, category: 'snacks', veg: false, restaurantIndex: 4, popularity: 140, imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400' },
    { name: 'Classic Cheese Burger', description: 'Beef patty with cheese and veggies', price: 199, category: 'lunch', veg: false, restaurantIndex: 5, popularity: 200, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { name: 'Veggie Burger', description: 'Plant-based patty with fresh vegetables', price: 169, category: 'lunch', veg: true, restaurantIndex: 5, popularity: 150, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400' },
    { name: 'Chicken Wings', description: 'Crispy fried chicken wings', price: 249, category: 'snacks', veg: false, restaurantIndex: 5, popularity: 180, imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400' },
    { name: 'Onion Rings', description: 'Crispy battered onion rings', price: 99, category: 'snacks', veg: true, restaurantIndex: 5, popularity: 120, imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400' },
    { name: 'Milkshake', description: 'Creamy vanilla milkshake', price: 129, category: 'beverages', veg: true, restaurantIndex: 5, popularity: 100, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' },
  ];

  const menuItemsToInsert = menuItems.map(item => ({
    ...item,
    restaurantId: createdRestaurants[item.restaurantIndex]._id
  }));

  await Menu.insertMany(menuItemsToInsert);
  console.log(`Seeded ${createdRestaurants.length} restaurants, ${menuItemsToInsert.length} menu items, ${badges.length} badges, and 2 users`);
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (mongoUri && typeof mongoUri === 'string' && mongoUri.trim()) {
    try {
      const conn = await mongoose.connect(mongoUri.trim(), {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      process.env.USE_MEMORY_DB = '';
      return;
    } catch (error) {
      console.warn(`MongoDB connection failed: ${error.message}`);
      console.log('Falling back to in-memory MongoDB...');
    }
  } else {
    console.log('MongoDB URI missing, using in-memory MongoDB...');
  }

  mongoMemServer = await MongoMemoryServer.create();
  const uri = mongoMemServer.getUri();
  await mongoose.connect(uri);
  console.log(`In-memory MongoDB started at ${uri}`);
  process.env.USE_MEMORY_DB = 'true';

  await seedData();
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemServer) {
    await mongoMemServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
