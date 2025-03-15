const jwt = require('jsonwebtoken');
const User = require('../../models/user/User');
require('dotenv').config();

// JWT secret key - should be in environment variables in production
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token, access denied'
            });
        }

        try {
            // Verify token using JWT_SECRET from env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find user by email to get their ID
            const user = await User.findOne({ email: decoded.email });
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Add user data to request
            req.user = {
                _id: user._id,
                email: decoded.email
            };
            
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = authMiddleware;
