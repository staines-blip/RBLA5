const axios = require('axios');
const config = require('./config');
const chalk = require('chalk');

// Create axios instance with default config
const api = axios.create({
    baseURL: config.API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Helper function to log steps
const logStep = (step, message) => {
    console.log(chalk.cyan(`\n[Step ${step}] ${message}`));
};

// Helper function to log success
const logSuccess = message => {
    console.log(chalk.green(`✓ ${message}`));
};

// Helper function to log error
const logError = (message, error) => {
    console.error(chalk.red(`✗ ${message}`));
    if (error.response) {
        console.error(chalk.red('Status:', error.response.status));
        console.error(chalk.red('Response data:', JSON.stringify(error.response.data, null, 2)));
    } else if (error.request) {
        console.error(chalk.red('No response received:', error.request));
    } else {
        console.error(chalk.red('Error message:', error.message));
    }
};

// Helper function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to shuffle array
const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Helper function to chunk array
const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

// 1. User Login
async function loginUser() {
    try {
        logStep(1, 'User Login');
        
        // Login with test user credentials
        const loginResponse = await api.post('/api/user/auth/login', {
            email: config.USER.email,
            password: config.USER.password
        });

        // Set token in axios defaults for all future requests
        const token = loginResponse.data.token;
        if (!token) {
            throw new Error('No token received in login response');
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Auth token set for future requests');

        logSuccess('User login successful');
    } catch (error) {
        logError('User login failed', error);
        throw error;
    }
}

// 2. Add Products to Cart
async function addProductsToCart(products) {
    try {
        logStep(2, 'Adding Products to Cart');

        // Clear cart first
        try {
            await api.delete('/api/user/cart');
            logSuccess('Cart cleared');
        } catch (error) {
            console.warn('Warning: Could not clear cart, proceeding anyway');
        }

        // Add each product to cart
        for (const product of products) {
            console.log(`Attempting to add product ${product._id} to cart (price: ${product.new_price})...`);
            
            await api.post('/api/user/cart/add', {
                productId: product._id,
                quantity: 1,
                price: product.new_price
            });

            logSuccess(`Added product ${product._id} to cart`);
            
            // Add delay between requests
            await delay(config.OPERATION_DELAY);
        }
    } catch (error) {
        logError('Failed to add products to cart', error);
        throw error;
    }
}

// 3. Process Payment and Create Order
async function processPaymentAndOrder() {
    try {
        logStep(3, 'Processing Payment and Creating Order');

        // Get cart total
        const cartResponse = await api.get('/api/user/cart');
        console.log('Cart response:', JSON.stringify(cartResponse.data).substring(0, 200) + '...');
        
        let cartItems = [];
        if (cartResponse.data && cartResponse.data.data && cartResponse.data.data.items) {
            cartItems = cartResponse.data.data.items;
        } else {
            throw new Error('Invalid cart response structure');
        }

        // Format products for order creation
        const formattedProducts = cartItems.map(item => ({
            product: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        // Calculate total amount with proper decimal handling
        const totalAmount = Number(cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2));

        // First, create a preliminary order
        console.log('Creating preliminary order...');
        const createOrderResponse = await api.post('/api/user/orders', {
            products: formattedProducts,
            shippingAddress: config.USER.shippingAddress,
            totalAmount: totalAmount
        });

        // Extract order ID from response
        const orderId = createOrderResponse.data.data._id;
        console.log(`Order ID: ${orderId}`);

        // Get Braintree client token
        const tokenResponse = await api.get('/api/user/braintree/token');
        logSuccess('Got payment token');

        // Process payment
        console.log('Processing payment...');
        console.log(`Total amount: ${totalAmount}`);
        const paymentResponse = await api.post('/api/user/braintree/payment', {
            nonce: config.PAYMENT.nonce,
            orderId: orderId,
            amount: totalAmount.toFixed(2) // Add amount back with proper decimal places
        });

        if (paymentResponse.data.success) {
            logSuccess('Payment processed successfully');
        } else {
            throw new Error('Payment failed');
        }

    } catch (error) {
        logError('Payment/Order processing failed', error);
        throw error;
    }
}

// Main function to run all steps
async function runBulkTest() {
    console.log(chalk.yellow('\n=== Starting Bulk Testing ===\n'));
    
    try {
        // 1. Login
        await loginUser();

        // Get all products
        console.log('Fetching products...');
        const productsResponse = await api.get('/api/public/products');
        if (!productsResponse.data || !productsResponse.data.data) {
            throw new Error('Invalid products response: ' + JSON.stringify(productsResponse.data));
        }
        const allProducts = productsResponse.data.data;
        console.log(`Found ${allProducts.length} products`);

        // Shuffle products and create chunks
        const shuffledProducts = shuffleArray([...allProducts]);
        const productChunks = chunkArray(shuffledProducts, config.PRODUCTS_PER_ORDER);
        console.log(`Created ${productChunks.length} chunks of ${config.PRODUCTS_PER_ORDER} products each`);

        // Process each chunk
        for (let i = 0; i < Math.min(config.ORDERS_PER_PRODUCT, productChunks.length); i++) {
            const chunk = productChunks[i];
            console.log(`\nProcessing chunk ${i + 1} of ${Math.min(config.ORDERS_PER_PRODUCT, productChunks.length)}`);
            
            // 2. Add products to cart
            await addProductsToCart(chunk);

            // 3. Process payment and create order
            await processPaymentAndOrder();

            // Add delay between orders
            if (i < productChunks.length - 1) {
                await delay(config.OPERATION_DELAY);
            }
        }

        console.log(chalk.green('\n=== Bulk Testing Completed Successfully ===\n'));
    } catch (error) {
        console.error(chalk.red('\n=== Bulk Testing Failed ==='));
        if (error.response) {
            console.error(chalk.red('Status:', error.response.status));
            console.error(chalk.red('Response data:', JSON.stringify(error.response.data, null, 2)));
        } else if (error.request) {
            console.error(chalk.red('No response received:', error.request));
        } else {
            console.error(chalk.red('Error message:', error.message));
        }
        process.exit(1);
    }
}

// Run the bulk test
runBulkTest();
