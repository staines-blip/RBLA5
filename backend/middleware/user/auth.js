const jwt = require('jsonwebtoken');
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
            
            // Add user data to request - using email as primary identifier
            req.user = {
                email: decoded.email // Primary identifier
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
