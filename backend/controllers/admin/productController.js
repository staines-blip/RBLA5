const { Product } = require('../../models');

// Get all products with optional filtering
exports.getAllProducts = async (req, res) => {
    try {
        const query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.isActive !== undefined) {
            query.isActive = req.query.isActive === 'true';
        }

        const products = await Product.find(query)
            .populate('category', 'name')
            .sort({ date: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new product
exports.createProduct = async (req, res) => {
    try {
        // Get the latest product to determine the next productid
        const latestProduct = await Product.findOne().sort({ productid: -1 });
        const nextProductId = latestProduct ? latestProduct.productid + 1 : 1;

        const product = new Product({
            productid: nextProductId,
            name: req.body.name,
            description: req.body.description,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            stock: req.body.stock,
            category: req.body.category,
            size: {
                breadth: req.body.size.breadth,
                height: req.body.size.height
            },
            images: req.body.images,
            image_url: req.body.image_url,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        });

        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update only the fields that are provided
        const updates = req.body;
        Object.keys(updates).forEach(key => {
            if (key === 'size' && updates.size) {
                product.size.breadth = updates.size.breadth || product.size.breadth;
                product.size.height = updates.size.height || product.size.height;
            } else {
                product[key] = updates[key];
            }
        });

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update product stock
exports.updateStock = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.stock = req.body.stock;
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Toggle product active status
exports.toggleActive = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.isActive = !product.isActive;
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
