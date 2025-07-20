const { createUser } = require('../models/userModel');

const register = (req, res) => {
  const userData = req.body;

  if (!userData.name || !userData.email || !userData.password || !userData.role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  createUser(userData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error registering user', error: err.message });
    }

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  });
};

module.exports = { register };
