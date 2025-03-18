const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API_URL = 'http://localhost:5000/api';

// Test user credentials
const TEST_USER = {
    email: '2301722049020@mcc.edu.in',
    password: 'karthi'
};

// Test order data - ordering multiple items
const TEST_ORDER = {
    products: [
        {
            product: "67ce974717698bf95b3da15a", // Paperfile 1 (₹35, stock: 6)
            quantity: 2
        }
    ],
    shippingAddress: {
        fullName: "Test User",
        address: "123 Test Street",
        city: "Test City",
        state: "Test State",
        pincode: "600001",
        phone: "1234567890"
    }
};

// Sleep function for adding delays between API calls
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function loginUser() {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, TEST_USER);
        return response.data.token;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        return null;
    }
}

async function testOrderPaymentFlow() {
    try {
        // 1. Login
        console.log('1. Logging in user...');
        const token = await loginUser();
        if (!token) {
            console.error('Failed to login. Aborting test.');
            return;
        }
        console.log('✓ Login successful');
        await sleep(1000);

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // 2. Create Order
        console.log('\n2. Creating test order...');
        console.log('Ordering:');
        console.log('- 2x Paperfile 1 (₹35)');
        console.log('Expected Total: ₹70\n');

        const orderResponse = await axios.post(
            `${API_URL}/user/orders`,
            TEST_ORDER,
            { headers }
        );
        
        if (!orderResponse.data.success) {
            throw new Error(JSON.stringify(orderResponse.data));
        }

        const order = orderResponse.data.data;
        console.log('✓ Order created successfully');
        console.log('Order Number:', order.orderNumber);
        console.log('Order ID:', order._id);
        console.log('Total Amount:', order.totalAmount);
        console.log('Products:', JSON.stringify(order.products, null, 2));
        await sleep(1000);

        // 3. Get Braintree Token
        console.log('\n3. Getting Braintree client token...');
        const tokenResponse = await axios.get(
            `${API_URL}/user/braintree/token`,
            { headers }
        );
        
        if (!tokenResponse.data.success || !tokenResponse.data.clientToken) {
            throw new Error('Failed to get client token');
        }
        
        console.log('✓ Received client token');
        await sleep(1000);

        // 4. Process Payment
        console.log('\n4. Processing payment for order...');
        const paymentData = {
            nonce: 'fake-valid-nonce',
            orderId: order._id
        };
        
        const paymentResponse = await axios.post(
            `${API_URL}/user/braintree/payment`,
            paymentData,
            { headers }
        );

        if (paymentResponse.data.success) {
            console.log('✓ Payment successful!');
            console.log('Transaction ID:', paymentResponse.data.transaction.id);
            console.log('Order Status:', paymentResponse.data.order.status);
            console.log('Payment Status:', paymentResponse.data.order.paymentStatus);
        } else {
            throw new Error('Payment failed: ' + JSON.stringify(paymentResponse.data));
        }
        await sleep(1000);

        // 5. Get all orders to verify
        console.log('\n5. Verifying order status...');
        const ordersResponse = await axios.get(
            `${API_URL}/user/orders`,
            { headers }
        );
        
        if (!ordersResponse.data.success) {
            throw new Error('Failed to get orders');
        }

        const orders = ordersResponse.data.data;
        const updatedOrder = orders.find(o => o._id === order._id);
        
        if (!updatedOrder) {
            throw new Error('Order not found in user orders');
        }

        console.log('✓ Final Order Details:');
        console.log('Order Number:', updatedOrder.orderNumber);
        console.log('Order Status:', updatedOrder.orderStatus);
        console.log('Payment Status:', updatedOrder.paymentStatus);
        await sleep(1000);

        // 6. Get Payment History
        console.log('\n6. Checking payment history...');
        const historyResponse = await axios.get(
            `${API_URL}/user/braintree/history`,
            { headers }
        );
        
        if (!historyResponse.data.success) {
            throw new Error('Failed to get payment history');
        }
        
        console.log('✓ Recent Payment History:');
        const recentPayment = historyResponse.data.data[0];
        if (recentPayment) {
            console.log('Transaction ID:', recentPayment.transactionId);
            console.log('Amount:', recentPayment.amount);
            console.log('Status:', recentPayment.status);
            console.log('Order Number:', recentPayment.orderNumber);
        } else {
            console.log('No payment history found');
        }

    } catch (error) {
        console.error('\nError:', error.message);
        if (error.response?.data) {
            console.error('API Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the test
console.log('Starting Order Payment Flow Test...');
console.log('==================================');
testOrderPaymentFlow();
