const jwt = require('jsonwebtoken');
const Admin = require('../../models/admin');
require('dotenv').config();

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Please provide both username and password' 
      });
    }

    // Find admin by username and include password field
    const admin = await Admin.findOne({ username }).select('+password');
    if (!admin) {
      return res.status(401).json({ 
        message: 'Invalid username or password' 
      });
    }

    // Verify password using the matchPassword method from admin model
    const isPasswordValid = await admin.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid username or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set token as httpOnly cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', 
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Send response
    res.status(200).json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        username: admin.username,
        storeName: admin.storeName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Failed to login. Please try again later.' 
    });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    // Clear the admin token cookie
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Failed to logout. Please try again later.' });
  }
};

const verifySession = async (req, res) => {
  try {
    // The adminMiddleware will already verify the token and attach admin to req
    // If we reach here, it means the token is valid
    res.status(200).json({
      message: 'Session is valid',
      admin: {
        id: req.admin._id,
        username: req.admin.username,
        storeName: req.admin.storeName
      }
    });
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ message: 'Failed to verify session' });
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  verifySession
};
