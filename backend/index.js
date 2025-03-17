const express = require('express');
const chalk = require('chalk');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
const connectDB = require('./utils/database/mongoConfig');

const productRoutes = require('./routes/productRoutes');
const workerRoutes = require('./routes/workerRoutes');
const superadminRoutes = require('./routes/superadmin');
const superadminAuthRoutes = require('./routes/superadminauthroutes');
const unitRoutes = require('./routes/unitRoutes');
const customerRoutes = require('./routes/superadmin/customerRoutes');
const adminRoutes = require('./routes/superadmin/admins');
const adminAuthRoutes = require('./routes/admin/adminAuthRoutes');
const adminProductRoutes = require('./routes/admin/productRoutes');
const adminCategoryRoutes = require('./routes/admin/categoryRoutes');
const adminUploadRoutes = require('./routes/admin/uploadRoutes');
const adminProductUnitRoutes = require('./routes/admin/productUnitRoutes');
const publicProductRoutes = require('./routes/public/productRoutes');
const publicGeneralRoutes = require('./routes/public/generalRoutes');
const publicRoutes = require('./routes/public/index');
const userAuthRoutes = require('./routes/user/auth');
const userProfileRoutes = require('./routes/user/profileRoutes');
const userCartRoutes = require('./routes/user/cartRoutes');
const userWishlistRoutes = require('./routes/user/wishlistRoutes');
const userOrderRoutes = require('./routes/user/orderRoutes');
const userBraintreeRoutes = require('./routes/user/braintreeRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Print welcome message
console.log(chalk.cyan('\n🚀 Initializing RBLA5 Backend Server...'));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Cookie parser middleware
app.use(cookieParser());

// Body parser middleware
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads', 'products')));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the NGO Products API!');
});

// API Routes of all the files 
app.use('/api/products', productRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/superadmin', superadminAuthRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/superadmin/customers', customerRoutes);
app.use('/api/superadmin/admins', adminRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/upload', adminUploadRoutes);
app.use('/api/admin/product-units', adminProductUnitRoutes);
app.use('/api/auth', userAuthRoutes);
app.use('/api/user', userProfileRoutes);
app.use('/api/user/cart', userCartRoutes);
app.use('/api/user/wishlist', userWishlistRoutes);
app.use('/api/user/orders', userOrderRoutes);
app.use('/api/user/braintree', userBraintreeRoutes);

// Public routes
app.use('/api/public', publicRoutes);
app.use('/api/public/products', publicProductRoutes);
app.use('/api/public', publicGeneralRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(chalk.red('❌ Error:'), err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      status: 'error',
      message: errors.join(', ')
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate field value entered'
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again.'
    });
  }

  // Token expired error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Your token has expired. Please log in again.'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Initialize server
async function startServer() {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      // ASCII art for server start
      const serverArt = `
    🌟 ${chalk.green('✓')} RBLA5 Server Started Successfully ${chalk.green('✓')} 🌟
    ===============================================
    ${chalk.cyan('🌐 Environment:')} ${chalk.yellow(process.env.NODE_ENV || 'development')}
    ${chalk.cyan('🚪 Port:')} ${chalk.green(PORT)}
    ${chalk.cyan('🔗 URL:')} ${chalk.green(`http://localhost:${PORT}`)}
    ${chalk.cyan('📡 Status:')} ${chalk.green('Online ✓')}
    ===============================================
      `;
      console.log(serverArt);
      console.log(chalk.green('✨ Server initialization complete!'));
      console.log(chalk.yellow('💡 Ready to handle requests\n'));
    });
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to start server:'), error);
    process.exit(1);
  }
}

// Start the server
startServer();