const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(200).json({
        clientSecret: null,
        message: 'Stripe not configured. Set STRIPE_SECRET_KEY in .env'
      });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      metadata: { userId: req.user._id.toString() }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
