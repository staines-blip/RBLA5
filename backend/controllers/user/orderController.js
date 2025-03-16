const Order = require('../../models/user/Order');
const Product = require('../../models/Product');

// Create new order
const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress } = req.body;

        // Calculate total amount and verify products
        let totalAmount = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.product} not found`
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product ${product.name}`
                });
            }

            // Use new_price from product model
            const itemPrice = product.new_price;
            totalAmount += itemPrice * item.quantity;

            orderProducts.push({
                product: item.product,
                quantity: item.quantity,
                price: itemPrice
            });
        }

        const order = new Order({
            user: req.user._id,
            products: orderProducts,
            totalAmount,
            shippingAddress,
            orderStatus: 'Pending',
            paymentStatus: 'Unpaid'
        });

        await order.save();

        // Update product stock
        for (const item of products) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } }
            );
        }

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Order creation error:', error);
        if (error.code === 11000) {
            // Handle duplicate key error gracefully
            return res.status(500).json({
                success: false,
                message: 'Error generating order number, please try again'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create order'
        });
    }
};

// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.product')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single order details
const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user._id
        }).populate('products.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Track order status
const trackOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user._id
        }).select('orderStatus orderDate deliveryDate');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderDetails,
    trackOrder
};
