const express = require('express');
const router = express.Router();
const { Product } = require('../../models');

// Get all products
router.get('/', async (req, res) => {
    try {
        const query = {};
        
        // Add filters if provided
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.isActive !== undefined) {
            query.isActive = req.query.isActive === 'true';
        }

        const products = await Product.find(query)
            .populate('category', 'name')
            .populate('unit', 'name')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get products by category name
router.get('/category/:categoryName', async (req, res) => {
    try {
        const { categoryName } = req.params;
        
        // First find the category ID by name
        const category = await require('../../models').Category.findOne({ 
            name: { $regex: new RegExp(categoryName, 'i') } // Case-insensitive search
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Then find all products in that category
        const products = await Product.find({ 
            category: category._id,
            isActive: true // Only show active products
        })
        .populate('category', 'name')
        .populate('unit', 'name')
        .sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate('unit', 'name');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
