const express = require('express');
const router = express.Router();
const {
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require('../../controllers/superadmin/AdminController');
const protectSuperadmin = require('../../middleware/superadminmiddleware'); // Assuming this middleware exists

// Base route: /api/superadmin/admins

// Create a new admin
router.post('/', protectSuperadmin, createAdmin);

// Update an admin by ID
router.put('/:id', protectSuperadmin, updateAdmin);

// Delete an admin by ID
router.delete('/:id', protectSuperadmin, deleteAdmin);

// Optional: Get all admins (if implemented)
router.get('/', protectSuperadmin, (req, res) => {
  res.status(501).json({ message: 'Get admins not implemented yet' });
  // Uncomment and implement if needed:
  // const { getAdmins } = require('../../controllers/superadmin/AdminController');
  // return getAdmins(req, res);
});

module.exports = router;