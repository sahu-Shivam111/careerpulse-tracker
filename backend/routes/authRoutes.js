const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for registering a user
// Endpoint: POST /api/auth/register
router.post('/register', authController.register);

// Route for logging in a user
// Endpoint: POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;
