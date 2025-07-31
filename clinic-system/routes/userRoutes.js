
const express = require('express');
const router = express.Router();

const { updateUserRole, updateUserProfile } = require('../controllers/userController');
const { protect, doctorAccess } = require('../middleware/authMiddleware');

// 🔹 PUT /api/user/:id/role → Only doctors can update roles
router.put('/:id/role', protect, doctorAccess, updateUserRole);

// 🔹 PUT /api/user/profile → Logged-in users can update their own profile
router.put('/profile', protect, updateUserProfile);

// 🔹 GET /api/user/:id → Fetch user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch {
    res.status(500).send({ message: 'Error fetching user' });
  }
});

module.exports = router;
