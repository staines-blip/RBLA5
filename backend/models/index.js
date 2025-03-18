const mongoose = require('mongoose');

// admin module categories/ products 
// Import schemas
const productSchema = require('./Product').schema;
const categorySchema = require('./schemas/categorySchema');
const Order = require('./user/Order');

// Create and export models
module.exports = {
    Product: mongoose.model('Product', productSchema),
    Category: mongoose.model('Category', categorySchema),
    Order: Order
};
// this is the index file for the admin user
// like the manager file for the cateogeries in the products file 
// 