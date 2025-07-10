const express = require('express');
const router = express.Router();

const { updateUserRole, updateUserProfile } = require('../controllers/userController');
const { protect, doctorAccess } = require('../middleware/authMiddleware');

// 🔹 PUT /api/users/:id/role → Only doctors can update roles
router.put('/:id/role', protect, doctorAccess, updateUserRole);

// 🔹 PUT /api/users/profile → Logged-in users can update their own profile
router.put('/profile', protect, updateUserProfile);

module.exports = router;
