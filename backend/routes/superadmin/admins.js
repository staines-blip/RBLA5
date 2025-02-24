const express = require('express');
const router = express.Router();
const {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAdmins, // Optional: if you want to list admins
} = require('../../controllers/superadmin/AdminController');

// Route to create a new admin
router.post('/create', createAdmin);

// Route to update an admin by id
router.put('/update/:id', updateAdmin);

// Route to soft delete an admin by id
router.delete('/delete/:id', deleteAdmin);

// Optional: Route to list all admins
router.get('/', getAdmins);

module.exports = router;
