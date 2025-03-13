// Refactored routes/auth.js
const express = require('express');
const { login, register, getUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authAdmin');

const router = express.Router();

// Authentication Routes
router.post('/login', login);
router.post('/register', register);
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;