const User = require('../../models/User');

// Create Admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, unitId } = req.body;

    // Check for required fields
    if (!name || !email || !password || !unitId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create admin user
    const adminUser = new User({
      name,
      email,
      password,
      role: 'admin',
      unitId,
    });

    await adminUser.save();
    res.status(201).json({ message: 'Admin created successfully', adminUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, unitId } = req.body;

    const updatedAdmin = await User.findByIdAndUpdate(
      id,
      { name, email, unitId },
      { new: true, runValidators: true }
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

    const adminUser = await User.findByIdAndUpdate(id, { isDeleted: true });

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
