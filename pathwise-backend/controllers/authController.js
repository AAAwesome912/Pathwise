const { createUser } = require('../models/userModel');

const register = (req, res) => {
  const userData = {
  ...req.body,
  name: req.body.name?.trim(),
  email: req.body.email?.trim(),
  role: req.body.role?.trim(),
  address: req.body.address?.trim(),
  contact: req.body.contact?.trim(),
};

  if (!userData.name || !userData.email || !userData.address || !userData.password || !userData.role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  createUser(userData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error registering user', error: err.message });
    }

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  });
};

const updateUserProfile = (req, res) => {
  const userId = req.params.id;
  const userData = {
    ...req.body,
    name: req.body.name?.trim(),
    email: req.body.email?.trim(),
    contact: req.body.contact?.trim(),
    address: req.body.address?.trim(),
    course: req.body.course?.trim()
  };

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // You can add validation for the fields here if needed
  
  updateUser(userId, userData, (err, result) => {
    if (err) {
      console.error('Error updating user:', err.message);
      return res.status(500).json({ message: 'Error updating user profile', error: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }
    
    res.json({ message: 'Profile updated successfully' });
  });
};

module.exports = { register, updateUserProfile };
