const Admin = require('../../models/admin'); // Updated to use the Admin model

// Create Admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, phoneNumber, username, password, storeName, aadharNumber } = req.body;

    // Check for required fields
    if (!name || !email || !phoneNumber || !username || !password || !storeName || !aadharNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if admin already exists (by email, username, or aadharNumber)
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }, { aadharNumber }],
    });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email, username, or Aadhar number already exists' });
    }

    // Create admin
    const admin = new Admin({
      name,
      email,
      phoneNumber,
      username,
      password, // Will be hashed automatically by the model
      storeName,
      aadharNumber,
    });

    await admin.save();
    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, username, storeName, aadharNumber } = req.body;

    // Find and update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { name, email, phoneNumber, username, storeName, aadharNumber },
      { new: true, runValidators: true } // Returns the updated document and runs schema validators
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin updated successfully', updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Hard delete (or soft delete if you prefer)
    const admin = await Admin.findByIdAndDelete(id); // Changed to hard delete
    // For soft delete, uncomment below and add `isDeleted` to the Admin model
    // const admin = await Admin.findByIdAndUpdate(id, { isDeleted: true });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};