import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from '../../../../services/userapi/orderAPI';
import { useUser } from '../../../../Context/UserContext';
import './MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useUser();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [isAuthenticated, navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getUserOrders();
            if (response.success) {
                setOrders(response.data);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (error) {
            setError(error.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'status-delivered';
            case 'Processing':
                return 'status-processing';
            case 'Pending':
                return 'status-pending';
            case 'Canceled':
                return 'status-canceled';
            default:
                return '';
        }
    };

    if (loading) {
        return <div className="orders-loading">Loading orders...</div>;
    }

    if (error) {
        return <div className="orders-error">{error}</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="orders-empty">
                <h2>No Orders Found</h2>
                <p>You haven't placed any orders yet.</p>
                <button onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="my-orders-container">
            <h1>My Orders</h1>
            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <div className="order-info">
                                <h3>Order #{order._id.slice(-8)}</h3>
                                <p>Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`order-status ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                            </span>
                        </div>
                        
                        <div className="order-products">
                            {order.products.map((item) => (
                                <div key={item._id} className="order-product">
                                    <img 
                                        src={item.product.image_url} 
                                        alt={item.product.name}
                                        onError={(e) => {
                                            e.target.src = '/placeholder.png';
                                        }}
                                    />
                                    <div className="product-details">
                                        <h4>{item.product.name}</h4>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer">
                            <div className="order-total">
                                <span>Total Amount:</span>
                                <span className="total-amount">₹{order.totalAmount}</span>
                            </div>
                            <div className="order-actions">
                                <button 
                                    onClick={() => navigate(`/orders/${order._id}`)}
                                    className="view-details-btn"
                                >
                                    View Details
                                </button>
                                <button 
                                    onClick={() => navigate(`/orders/${order._id}/track`)}
                                    className="track-order-btn"
                                >
                                    Track Order
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
