const mongoose = require('mongoose');

// Import all schemas
const productSchema = require('./schemas/productSchema');
const categorySchema = require('./schemas/categorySchema');

// Create and export models
module.exports = {
    Product: mongoose.model('Product', productSchema),
    Category: mongoose.model('Category', categorySchema)
};
