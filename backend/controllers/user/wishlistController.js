const Wishlist = require('../../models/user/Wishlist');
const Product = require('../../models/Product');

const wishlistController = {
    // Get user's wishlist
    getWishlist: async (req, res) => {
        try {
            let wishlist = await Wishlist.findOne({ user: req.user._id })
                .populate('items.product', 'name price images description');

            if (!wishlist) {
                wishlist = await Wishlist.create({ user: req.user._id, items: [] });
            }

            res.json(wishlist);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
        }
    },

    // Add item to wishlist
    addToWishlist: async (req, res) => {
        try {
            const { productId } = req.body;

            // Validate product exists
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            let wishlist = await Wishlist.findOne({ user: req.user._id });

            // Create wishlist if it doesn't exist
            if (!wishlist) {
                wishlist = new Wishlist({ user: req.user._id, items: [] });
            }

            // Check if product already exists in wishlist
            const existingItem = wishlist.items.find(
                item => item.product.toString() === productId
            );

            if (existingItem) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }

            // Add new item
            wishlist.items.push({ product: productId });
            await wishlist.save();

            // Return populated wishlist
            wishlist = await wishlist.populate('items.product', 'name price images description');
            
            res.json(wishlist);
        } catch (error) {
            res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
        }
    },

    // Remove item from wishlist
    removeFromWishlist: async (req, res) => {
        try {
            const { productId } = req.params;

            const wishlist = await Wishlist.findOne({ user: req.user._id });
            
            if (!wishlist) {
                return res.status(404).json({ message: 'Wishlist not found' });
            }

            wishlist.items = wishlist.items.filter(
                item => item.product.toString() !== productId
            );

            await wishlist.save();
            
            // Return populated wishlist
            await wishlist.populate('items.product', 'name price images description');
            
            res.json(wishlist);
        } catch (error) {
            res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
        }
    },

    // Clear entire wishlist
    clearWishlist: async (req, res) => {
        try {
            const wishlist = await Wishlist.findOne({ user: req.user._id });
            
            if (!wishlist) {
                return res.status(404).json({ message: 'Wishlist not found' });
            }

            wishlist.items = [];
            await wishlist.save();

            res.json({ message: 'Wishlist cleared successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error clearing wishlist', error: error.message });
        }
    }
};

module.exports = wishlistController;
