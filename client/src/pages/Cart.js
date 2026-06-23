import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cart, restaurant, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryAddress] = useState('123 Main Street, Downtown');

  const deliveryFee = restaurant?.deliveryFee || 40;
  const subtotal = getCartTotal();
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious food from our restaurants!</p>
          <Link to="/" className="btn-primary">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        {restaurant && (
          <div className="cart-restaurant-badge">
            <span className="badge-label">Ordering from</span>
            <strong>{restaurant.name}</strong>
          </div>
        )}
      </div>

      <div className="cart-layout">
        <div className="cart-left">
          <div className="cart-items">
            {cart.map((item, index) => (
              <React.Fragment key={item._id}>
                <CartItem item={item} />
                {index < cart.length - 1 && <div className="cart-item-divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="cart-right">
          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>

            {restaurant && (
              <div className="summary-restaurant">
                <span className="summary-label" style={{ textTransform: 'none', letterSpacing: 0 }}>Restaurant</span>
                <span className="summary-value">{restaurant.name}</span>
              </div>
            )}

            <div className="summary-rows">
              <div className="summary-row">
                <span>Item Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="summary-row">
                <span>Taxes (GST 5%)</span>
                <span>₹{tax}</span>
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <div className="summary-section">
              <label className="summary-label">Payment Method</label>
              <div className="payment-options">
                <label className={`payment-option-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <span className="payment-option-label">Cash on Delivery</span>
                </label>
                <label className={`payment-option-card ${paymentMethod === 'online' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                  />
                  <span className="payment-option-label">Online Payment</span>
                </label>
              </div>
            </div>

            <div className="summary-section">
              <div className="delivery-address-header">
                <label className="summary-label">Delivery Address</label>
                <button className="edit-address-btn" title="Edit address">✎</button>
              </div>
              <p className="delivery-address-text">{deliveryAddress}</p>
            </div>

            <button onClick={handleCheckout} className="place-order-btn">
              Place Order • ₹{total}
            </button>

            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
