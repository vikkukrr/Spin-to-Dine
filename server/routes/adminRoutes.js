const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllUsers, deleteUser,
  getAllOrders, updateOrder,
  createRestaurant, updateRestaurant, deleteRestaurant,
  createMenuItem, updateMenuItem, deleteMenuItem,
  createBadge, getAllBadges, deleteBadge
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrder);

router.post('/restaurants', createRestaurant);
router.put('/restaurants/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);

router.post('/menu', createMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

router.get('/badges', getAllBadges);
router.post('/badges', createBadge);
router.delete('/badges/:id', deleteBadge);

module.exports = router;
