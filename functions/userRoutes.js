const express = require('express');
const User = require('./User');
const Admin = require('./Admin');
const router = express.Router();
const serverless = require('serverless-http');

// Create a new user
router.post('/users', async (req, res) => {
  const { name, email, phone } = req.body;
  const user = new User({ name, email, phone });
  try {
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({actualError: error.errorMessage, message: 'You have already registered with us.', isNumberExists: true, error: error });
    }
    res.status(400).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/admins', async (req, res) => {
  const { loginID, password } = req.body;

  const admins = new Admin({ loginID, password })
  try {
    const admin = await Admin.findOne({ loginID });
    if (!admin) {
      return res.status(404).json({ message: 'User not found', isLoggedAsAdmin: false });
    }
    const password = req.body.password; // The password provided by the user
    const isMatch = await Admin.findOne({ password });
    if (!password) {
      return res.status(400).json({ message: 'Password is missing', isLoggedAsAdmin: false });
    }
    if (isMatch) {
      // Successful login
      return res.status(200).json({ message: 'Login successful', isLoggedAsAdmin: true });
    } else {
      // Incorrect password
      return res.status(401).json({ message: 'Invalid password', isLoggedAsAdmin: false });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, errorMessage: error, isLoggedAsAdmin: false });
  }
});

module.exports = router;