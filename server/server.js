const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI Found' : 'URI MISSING - CHECK .ENV');

const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const spinRoutes = require('./routes/spinRoutes');
const adminRoutes = require('./routes/adminRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const socialRoutes = require('./routes/socialRoutes');

const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/test-db', (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.json({
      dbState: states[state],
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Missing',
      memoryDb: process.env.USE_MEMORY_DB === 'true' ? 'Yes' : 'No'
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/spin', spinRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/social', socialRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Food Delivery API is running!' });
});

const clientBuild = path.join(__dirname, '..', 'client', 'build');
const fs = require('fs');
if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
  console.log('Serving React build from:', clientBuild);
} else {
  console.log('React build not found at:', clientBuild);
  console.log('API is running but frontend needs to be built with: cd client && npm run build');
  app.get(/^\/(?!api).*/, (req, res) => {
    res.json({ message: 'Frontend not built. Run "cd client && npm run build" first.' });
  });
}

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  console.log('Database connected, ready to handle requests');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect database:', err.message);
  process.exit(1);
});

module.exports = app;
