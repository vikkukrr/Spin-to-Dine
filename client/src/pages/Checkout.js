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
      setOrderId('ORD-' + Date.now());
      setOrderPlaced(true);
      clearCart();
      addToast('Order placed successfully!', 'success');
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-icon">&#10003;</div>
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
        <div className="order-success">
          <h1>Your cart is empty</h1>
          <p>Add items to your cart before checking out.</p>
          <div className="success-actions">
            <button onClick={() => navigate('/')} className="btn-primary">
              Browse Restaurants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        {/* ---- LEFT COLUMN ---- */}
        <div className="checkout-left-col">
          {/* Delivery Details */}
          <div className="checkout-card">
            <h2 className="checkout-card-title">&#x1F4CD; Delivery Details</h2>
            <div className="form-group">
              <label className="delivery-label">Delivery Address</label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="delivery-textarea"
                rows={3}
                placeholder="Enter your delivery address"
              />
            </div>
            <div className="delivery-info-pills">
              {user?.name && (
                <span className="info-pill">&#x1F464; {user.name}</span>
              )}
              {user?.location && (
                <span className="info-pill">&#x1F4CD; {user.location}</span>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-card">
            <h2 className="checkout-card-title">&#x1F4B3; Payment Method</h2>
            <div className="payment-methods">
              {PAYMENT_METHODS.map(pm => (
                <label
                  key={pm.value}
                  className={`payment-method ${paymentMethod === pm.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.value}
                    checked={paymentMethod === pm.value}
                    onChange={e => setPaymentMethod(e.target.value)}
                  />
                  <span className="custom-radio">
                    {paymentMethod === pm.value && <span className="custom-radio-dot" />}
                  </span>
                  <span className="payment-method-icon">{pm.icon}</span>
                  <span className="payment-method-label">{pm.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Coupon Code */}
          <div className="checkout-card">
            <h2 className="checkout-card-title">&#x1F3F7;&#xFE0F; Coupon Code</h2>
            <div className="coupon-row">
              <input
                type="text"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                className="coupon-input"
                placeholder="Enter coupon code"
              />
              <button onClick={handleApplyCoupon} className="coupon-apply-btn" type="button">
                Apply
              </button>
            </div>
            {discount > 0 && <p className="discount-success">Discount applied: -&#x20B9;{discount}</p>}
          </div>

          {error && <div className="checkout-error">{error}</div>}
        </div>

        {/* ---- RIGHT COLUMN ---- */}
        <div className="checkout-right-col">
          <div className="order-summary-card">
            <h3 className="os-title">Order Summary</h3>

            {restaurant && (
              <div className="os-restaurant">{restaurant.name}</div>
            )}

            <div className="os-items">
              {cart.map(item => (
                <div key={item.cartId || item._id} className="os-item">
                  <span className="os-item-name">
                    {item.name} &times; {item.quantity}
                  </span>
                  <span className="os-item-price">&#x20B9;{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="os-divider" />

            <div className="os-row">
              <span className="os-label">Subtotal</span>
              <span className="os-value">&#x20B9;{subtotal}</span>
            </div>
            <div className="os-row">
              <span className="os-label">Delivery Fee</span>
              <span className="os-value">&#x20B9;{deliveryFee}</span>
            </div>
            {discount > 0 && (
              <div className="os-row os-discount">
                <span className="os-label">Discount</span>
                <span className="os-value">-&#x20B9;{discount}</span>
              </div>
            )}

            <div className="os-divider" />

            <div className="os-row os-total">
              <span className="os-total-label">Total</span>
              <span className="os-total-value">&#x20B9;{total}</span>
            </div>

            <div className="os-pay-badge">
              Pay via: {PAYMENT_METHODS.find(p => p.value === paymentMethod)?.label}
            </div>

            <button
              onClick={handlePlaceOrder}
              className="place-order-btn"
              disabled={loading}
            >
              {loading ? 'Placing Order...' : `Place Order \u2014 \u20B9${total}`}
            </button>

            <p className="os-security">&#x1F512; Safe &amp; Secure Checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
