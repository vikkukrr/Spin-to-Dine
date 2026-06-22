import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash on Delivery', icon: '💵' },
  { value: 'card', label: 'Card Payment', icon: '💳' },
  { value: 'online', label: 'Online Payment (UPI/Net Banking)', icon: '📱' }
];

const Checkout = () => {
  const { cart, restaurant, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [address, setAddress] = useState(user?.address || '');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const deliveryFee = restaurant?.deliveryFee || 0;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee - discount;

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (code === 'SPIN10') {
      setDiscount(Math.round(subtotal * 0.1));
      addToast('Coupon applied! 10% off', 'success');
    } else if (code === 'WELCOME50') {
      setDiscount(50);
      addToast('Coupon applied! ₹50 off', 'success');
    } else {
      addToast('Invalid coupon code', 'error');
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    if (!address.trim()) {
      addToast('Please enter a delivery address', 'error');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: cart.map(item => ({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: total,
        deliveryFee: deliveryFee,
        deliveryAddress: address,
        paymentMethod: paymentMethod,
        restaurantId: restaurant._id,
        restaurantName: restaurant.name
      };

      const response = await api.post('/orders', orderData);

      setOrderId(response.data._id);
      setOrderPlaced(true);
      clearCart();
      addToast('Order placed successfully!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p>Your order ID is: <strong>{orderId}</strong></p>
          <p>We'll notify you when your order is confirmed.</p>
          <div className="success-actions">
            <button onClick={() => navigate('/orders')} className="btn-primary">
              View Orders
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        <div className="checkout-form">
          <div className="checkout-section">
            <h2>Delivery Details</h2>
            <div className="form-group">
              <label>Delivery Address</label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="form-input"
                rows={3}
                placeholder="Enter your delivery address"
              />
            </div>
            <div className="delivery-info">
              <p><strong>Deliver to:</strong> {user?.name}</p>
              {user?.location && <p><strong>Location:</strong> {user.location}</p>}
            </div>
          </div>

          <div className="checkout-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              {PAYMENT_METHODS.map(pm => (
                <label key={pm.value} className={`payment-option ${paymentMethod === pm.value ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={pm.value}
                    checked={paymentMethod === pm.value}
                    onChange={e => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">{pm.icon}</span>
                  <span className="payment-label">{pm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="checkout-section">
            <h2>Coupon Code</h2>
            <div className="coupon-input-group">
              <input
                type="text"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                className="form-input"
                placeholder="Enter coupon code"
              />
              <button onClick={handleApplyCoupon} className="btn-secondary" type="button">Apply</button>
            </div>
            {discount > 0 && <p className="discount-text">Discount applied: -₹{discount}</p>}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={handlePlaceOrder}
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Placing Order...' : `Place Order - ₹${total}`}
          </button>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="restaurant-name">{restaurant?.name}</div>

          {cart.map(item => (
            <div key={item.cartId || item._id} className="summary-item">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
          {discount > 0 && (
            <div className="summary-row discount">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <div className="payment-info">
            Pay via: {PAYMENT_METHODS.find(p => p.value === paymentMethod)?.label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
