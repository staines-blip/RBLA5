const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const workerRoutes = require('./routes/workerRoutes');
const superadminRoutes = require('./routes/superadmin');
const superadminAuthRoutes = require('./routes/superadminauthroutes');
const unitRoutes = require('./routes/unitRoutes');
const customerRoutes = require('./routes/superadmin/customerRoutes');
const adminRoutes = require('./routes/superadmin/admins');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

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

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
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

  // Default error
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});