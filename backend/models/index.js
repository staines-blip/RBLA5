const mongoose = require('mongoose');

// Import schemas
const productSchema = require('./Product').schema;
const categorySchema = require('./schemas/categorySchema');

// Create and export models
module.exports = {
    Product: mongoose.model('Product', productSchema),
    Category: mongoose.model('Category', categorySchema)
};
