const jwt = require('jsonwebtoken');
const Admin = require('../../models/admin');

const adminMiddleware = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.adminToken;
        
        if (!token) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Please log in to access this resource' 
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if admin exists and is active
            const admin = await Admin.findById(decoded.id).select('-password');
            if (!admin) {
                return res.status(401).json({ 
                    status: 'error',
                    message: 'The admin associated with this token no longer exists' 
                });
            }

            // Add admin and token info to request object
            req.admin = admin;
            req.token = token;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: 'error',
                    message: 'Your session has expired. Please log in again'
                });
            }
            
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid token. Please log in again'
                });
            }

            throw err; // Re-throw unexpected errors
        }
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Authentication failed. Please try again later'
        });
    }
};

module.exports = { adminMiddleware };
