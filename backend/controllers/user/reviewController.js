const Review = require('../../models/user/Review');
const Order = require('../../models/user/Order');

// Create a new review
const createReview = async (req, res, next) => {
    try {
        const { productId, rating, title, comment } = req.body;
        const userId = req.user._id;

        // Check if user has already reviewed this product
        const existingReview = await Review.findOne({ user: userId, product: productId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        // Check if user has purchased the product
        const hasOrdered = await Order.findOne({
            user: userId,
            'products.product': productId,
            orderStatus: 'Delivered'
        });

        const review = new Review({
            user: userId,
            product: productId,
            rating,
            title,
            comment,
            verifiedPurchase: !!hasOrdered
        });

        await review.save();

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// Get reviews for a product
const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { sort = '-createdAt', page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ product: productId })
            .populate('user', 'name')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Review.countDocuments({ product: productId });

        res.json({
            success: true,
            data: reviews,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

// Update a review
const updateReview = async (req, res, next) => {
    try {
        const { rating, title, comment } = req.body;
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or unauthorized'
            });
        }

        review.rating = rating || review.rating;
        review.title = title || review.title;
        review.comment = comment || review.comment;

        await review.save();

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// Delete a review
const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or unauthorized'
            });
        }

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Vote on a review
const voteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Increment helpful votes
        review.helpfulVotes = (review.helpfulVotes || 0) + 1;
        await review.save();

        res.json({
            success: true,
            data: {
                ...review.toObject(),
                votes: review.helpfulVotes
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    voteReview
};
