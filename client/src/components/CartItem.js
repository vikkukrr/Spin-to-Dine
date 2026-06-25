import React from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item-card">
      <img
        src={item.imageUrl || 'https://via.placeholder.com/80x80?text=Dish'}
        alt={item.name}
        className="cart-item-img"
      />
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-unit-price">₹{item.price} each</p>
      </div>
      <div className="cart-item-actions">
        <div className="qty-stepper">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="qty-btn"
          >−</button>
          <span className="qty-value">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="qty-btn"
          >+</button>
        </div>
        <span className="cart-item-subtotal">₹{item.price * item.quantity}</span>
        <button
          onClick={() => removeFromCart(item._id)}
          className="cart-remove-link"
        >Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
