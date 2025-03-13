const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../../controllers/user/profileController');
const authMiddleware = require('../../middleware/user/auth');

// All routes in this file are protected with auth middleware
router.use(authMiddleware);

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.put('/profile', updateProfile);

module.exports = router;
