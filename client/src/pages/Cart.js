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
          <p>Add some delicious food to get started!</p>
          <Link to="/" className="explore-btn">Explore Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="cart-header-inner">
          <h1>Your Cart</h1>
          {restaurant && (
            <p className="cart-ordering-from">
              Ordering from <strong>{restaurant.name}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items-col">
          {cart.map((item) => (
            <CartItem key={item.cartId || item._id} item={item} />
          ))}
        </div>

        <div className="cart-summary-col">
          <div className="order-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            {restaurant && (
              <div className="summary-row">
                <span className="summary-label">Restaurant</span>
                <span className="summary-value">{restaurant.name}</span>
              </div>
            )}

            <div className="summary-divider" />

            <div className="summary-row">
              <span className="summary-label">Item Subtotal</span>
              <span className="summary-value">₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Delivery Fee</span>
              <span className="summary-value">₹{deliveryFee}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Taxes (GST 5%)</span>
              <span className="summary-value">₹{tax}</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total">
              <span className="total-label">Total</span>
              <span className="total-value">₹{total}</span>
            </div>

            <div className="payment-section">
              <h4 className="payment-section-title">Payment Method</h4>

              <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span>💵 Cash on Delivery</span>
              </label>

              <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <span>💳 Card Payment</span>
              </label>

              <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                />
                <span>📱 UPI / Net Banking</span>
              </label>
            </div>

            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout → ₹{total}
            </button>

            <p className="secure-checkout">🔒 Secure checkout</p>

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
