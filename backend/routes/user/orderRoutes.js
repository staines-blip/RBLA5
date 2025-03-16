const express = require('express');
const router = express.Router();
const orderAuth = require('../../middleware/user/orderAuth');
const {
    createOrder,
    getUserOrders,
    getOrderDetails,
    trackOrder
} = require('../../controllers/user/orderController');

// All routes are protected with orderAuth middleware
router.use(orderAuth);

// Create new order
router.post('/', createOrder);

// Get all orders for the user
router.get('/', getUserOrders);

// Get single order details
router.get('/:id', getOrderDetails);

// Track order status
router.get('/:id/track', trackOrder);

module.exports = router;
