import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../Context/CartContext';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems: cart, cartTotal: total, clearCart } = useCart();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Generate a random order ID (in real app, this would come from backend)
    setOrderId(`ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  }, []);

  const handleContinueShopping = () => {
    clearCart(); // Clear the cart after successful order
    navigate('/');
  };

  const handleViewOrders = () => {
    clearCart(); // Clear the cart after successful order
    navigate('/orders');
  };

  return (
    <div className="place-order-container">
      <div className="order-success">
        <div className="success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p>Order ID: {orderId}</p>
      </div>

      <div className="order-details">
        <h3>Order Details</h3>
        <div className="items-list">
          {cart.map((item) => (
            <div key={item.id} className="order-item">
              <img src={item.image} alt={item.name} />
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{total}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>₹{total > 1000 ? 0 : 50}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{total > 1000 ? total : total + 50}</span>
          </div>
        </div>

        <div className="delivery-info">
          <h3>Estimated Delivery</h3>
          <p>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>

        <div className="action-buttons">
          <button onClick={handleViewOrders} className="view-orders-btn">
            View Orders
          </button>
          <button onClick={handleContinueShopping} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
