const Product = require('../../models/Product');
const mongoose = require('mongoose'); // mongoose is required for ObjectId validation
const path = require('path');
const fs = require('fs');

// Get all products with pagination
exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .select('name price description images category ratings numOfReviews')
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            success: true,
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get single product details
exports.getProductDetails = async (req, res) => {
    try {
        console.log('Fetching product details for ID:', req.params.id);

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }

        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate('unit', 'name')
            .lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Format image paths to be relative to the uploads directory
        const processedProduct = {
            ...product,
            image_url: `/uploads/products/${path.basename(product.image_url)}`,
            images: Array.isArray(product.images) && product.images.length > 0
                ? product.images.map(img => `/uploads/products/${path.basename(img)}`)
                : [`/uploads/products/${path.basename(product.image_url)}`]
        };

        console.log('Final processed product data:', {
            id: processedProduct._id,
            name: processedProduct.name,
            image_url: processedProduct.image_url,
            images: processedProduct.images
        });

        res.status(200).json({
            success: true,
            product: processedProduct
        });
    } catch (error) {
        console.error('Product details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product details',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const products = await Product.find({ category })
            .select('name price description images ratings numOfReviews')
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments({ category });

        res.status(200).json({
            success: true,
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products by category',
            error: error.message
        });
    }
};
