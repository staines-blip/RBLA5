import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../Context/CartContext';
import { useUser } from '../../../Context/UserContext';
import { createOrder } from '../../../services/userapi/orderAPI';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems: cart, cartTotal: total, clearCart } = useCart();
  const { user } = useUser();
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to place an order');
      navigate('/login');
      return;
    }

    // Check if cart is empty
    if (!cart.length) {
      navigate('/cart');
      return;
    }

    // Check if user data is available
    if (!user || !user._id) {
      setError('User data not available');
      navigate('/login');
      return;
    }

    createNewOrder();
  }, []);

  const createNewOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // Format cart items for order according to schema
      const orderData = {
        user: user._id, // Reference to User model
        products: cart.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        orderStatus: 'Pending',
        paymentStatus: 'Unpaid',
        totalAmount: total,
        shippingAddress: {
          fullName: user.name,
          address: user.address,
          city: user.city,
          state: user.state,
          pincode: user.pincode,
          phone: user.phone
        },
        orderDate: new Date()
      };

      const response = await createOrder(orderData);
      if (response.success) {
        setOrderId(response.data._id);
        clearCart(); // Clear cart only after successful order creation
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (err) {
      if (err.message.includes('login')) {
        navigate('/login');
      }
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (loading) {
    return <div className="place-order-container">
      <div className="order-success">
        <h2>Creating your order...</h2>
      </div>
    </div>;
  }

  if (error) {
    return <div className="place-order-container">
      <div className="order-error">
        <h2>Failed to create order</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/cart')}>Return to Cart</button>
      </div>
    </div>;
  }

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
            <div key={item.productId} className="order-item">
              <img src={item.productDetails.image} alt={item.productDetails.name} />
              <div className="item-info">
                <h4>{item.productDetails.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Total Amount:</span>
            <span>₹{total}</span>
          </div>
        </div>

        <div className="order-actions">
          <button onClick={handleContinueShopping} className="continue-shopping">
            Continue Shopping
          </button>
          <button onClick={handleViewOrders} className="view-orders">
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
