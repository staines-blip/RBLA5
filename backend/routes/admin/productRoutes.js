const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');
const { adminMiddleware } = require('../../middleware/admin/adminMiddleware');

// All routes are protected by adminMiddleware
router.use(adminMiddleware);

// GET all products with optional filtering
router.get('/', productController.getAllProducts);

// GET single product
router.get('/:id', productController.getProduct);

// POST create new product
router.post('/', productController.createProduct);

// PUT update product
router.put('/:id', productController.updateProduct);

// DELETE product
router.delete('/:id', productController.deleteProduct);

// PATCH update product stock
router.patch('/:id/stock', productController.updateStock);

// PATCH update all product stocks
router.patch('/update-all-stocks', productController.updateAllStocks);

// PATCH toggle product active status
router.patch('/:id/toggle-active', productController.toggleActive);

module.exports = router;
