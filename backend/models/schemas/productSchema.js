const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productid: {  
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock quantity cannot be negative'],
    },
    category: {  
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: true,
    },
    size: {
        breadth: { type: Number, required: true },
        height: { type: Number, required: true },
    },
    images: [{
        type: String,  
    }],
    image_url: { 
        type: String,  
        required: true  
    },
    ratings: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String }
    }],
    isActive: {
        type: Boolean,
        default: true,  
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = productSchema;
