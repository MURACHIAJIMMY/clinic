// // const express = require('express');
// // const { registerUser, loginUser, sendResetEmail, resetPassword } = require('../controllers/authController');

// // const router = express.Router();

// // // 🔹 Helper function to handle errors properly
// // const asyncHandler = (fn) => (req, res, next) => {
// //     Promise.resolve(fn(req, res, next)).catch(next);
// // };

// // // ✅ User signup route
// // router.post('/register', asyncHandler(registerUser));

// // // ✅ User login route
// // router.post('/login', asyncHandler(loginUser));

// // // ✅ Password reset request
// // router.post('/forgot-password', asyncHandler(sendResetEmail));

// // // ✅ Submit new password
// // router.post('/reset/:token', asyncHandler(resetPassword));

// // module.exports = router;

// const express = require('express')
// const {
//   registerUser,
//   loginUser,
//   sendResetEmail,
//   resetPassword
// } = require('../controllers/authController')

// console.log('🚀 authRoutes.js loaded – registering /register, /login, /forgot-password, /reset/:token')

// const router = express.Router()

// // Helper to wrap async handlers
// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next)
// }

// // User signup
// router.post('/register', asyncHandler(registerUser))

// // User login
// router.post('/login', asyncHandler(loginUser))

// // Password reset request
// router.post('/forgot-password', asyncHandler(sendResetEmail))

// // Submit new password
// router.post('/reset/:token', asyncHandler(resetPassword))

// module.exports = router

const express = require('express');
const {
  registerUser,
  loginUser,
  sendResetEmail,
  resetPassword
} = require('../controllers/authController');

console.log('🚀 authRoutes.js loaded – registering /register, /login, /forgot-password, /reset/:token');

const router = express.Router();

// Helper to wrap async handlers
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Re-enable signup & login routes
router.post('/register',      asyncHandler(registerUser));
router.post('/login',         asyncHandler(loginUser));
router.post('/forgot-password', asyncHandler(sendResetEmail));
router.post('/reset/:token',    asyncHandler(resetPassword));

module.exports = router;
