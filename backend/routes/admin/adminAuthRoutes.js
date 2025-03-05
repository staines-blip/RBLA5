const express = require('express');
const { loginAdmin } = require('../../controllers/admin/adminAuthController');
const router = express.Router();

// Admin login route
router.post('/login', loginAdmin);

module.exports = router;
