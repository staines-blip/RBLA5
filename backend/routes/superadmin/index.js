const express = require('express');
const router = express.Router();
const { createAdmin, updateAdmin, deleteAdmin, getAdmins } = require('../../controllers/superadmin/AdminController');

// Create a new admin
router.post('/create', createAdmin);

// Update an admin by id
router.put('/update/:id', updateAdmin);

// Delete an admin by id (soft delete)
router.delete('/delete/:id', deleteAdmin);


 //router.get('/', getAdmins); 

module.exports = router;
