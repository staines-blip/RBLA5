const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SuperAdmin = require('../../models/superadmin');
require('dotenv').config();

const loginSuperadmin = async (req, res) => {
  console.log('Login attempt received:', req.body);
  const { username, password } = req.body;

  try {
    console.log('Looking for superadmin with username:', username);
    const superadmin = await SuperAdmin.findOne({ username });
    console.log('Superadmin found:', superadmin ? 'Yes' : 'No');

    if (!superadmin) {
      return res.status(400).json({ message: 'Superadmin not found' });
    }

    console.log('Checking password...');
    const isMatch = await bcrypt.compare(password, superadmin.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    console.log('Generating token...');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    const token = jwt.sign(
      { superadminId: superadmin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Token generated successfully');
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  loginSuperadmin,
};