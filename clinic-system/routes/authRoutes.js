const express = require('express');
const { registerUser, loginUser, sendResetEmail, resetPassword } = require('../controllers/authController');

const router = express.Router();

// 🔹 Helper function to handle errors properly
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ✅ User signup route
router.post('/register', asyncHandler(registerUser));

// ✅ User login route
router.post('/login', asyncHandler(loginUser));

// ✅ Password reset request
router.post('/forgot-password', asyncHandler(sendResetEmail));

// ✅ Submit new password
router.post('/reset/:token', asyncHandler(resetPassword));

module.exports = router;
