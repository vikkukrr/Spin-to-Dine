const Order = require('../models/Order');
const User = require('../models/User');
const Menu = require('../models/Menu');
const { checkAndAwardBadges } = require('./authController');

const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, restaurantId, restaurantName, totalAmount, deliveryFee } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      deliveryFee: deliveryFee || 0,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cash',
      restaurantId,
      restaurantName,
      deliveryStatus: 'placed'
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { orderHistory: order._id },
      $inc: { loyaltyPoints: Math.round(totalAmount * 0.1) }
    });

    for (const item of items) {
      await Menu.findByIdAndUpdate(item.menuItemId, {
        $inc: { popularity: 1 }
      });
    }

    await checkAndAwardBadges(req.user._id);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, search } = req.query;
    let query = { userId: req.user._id };

    if (status && status !== 'all') {
      query.deliveryStatus = status;
    }

    if (startDate || endDate) {
      query.orderedAt = {};
      if (startDate) query.orderedAt.$gte = new Date(startDate);
      if (endDate) query.orderedAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { restaurantName: { $regex: search, $options: 'i' } },
        { 'items.name': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .sort({ orderedAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.deliveryStatus = deliveryStatus;

    if (deliveryStatus === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'paid';
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.deliveryStatus !== 'placed' && order.deliveryStatus !== 'confirmed') {
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    }

    order.deliveryStatus = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder, getUserOrders, getOrderById, updateOrderStatus, cancelOrder
};
