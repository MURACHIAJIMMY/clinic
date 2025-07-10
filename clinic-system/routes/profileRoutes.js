const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const Patient = require('../Models/patientModel');
const { protect } = require('../middleware/authMiddleware'); // assuming you use JWT protection

const router = express.Router();

// 🔼 Profile Image Upload Route
router.put('/profile-image', protect, upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const updated = await Patient.findOneAndUpdate(
      { userId: req.user.id },
      { profileImage: imagePath },
      { new: true }
    );

    res.status(200).json({ message: 'Image uploaded successfully', profileImage: imagePath });
  } catch (err) {
    console.error('❌ Image upload error:', err.message);
    res.status(500).json({ message: 'Server error uploading image' });
  }
});

module.exports = router;
