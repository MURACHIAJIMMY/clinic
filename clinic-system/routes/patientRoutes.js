// const express = require('express');
// const router = express.Router();
// const { getPatients } = require('../controllers/patientController');
// const { protect, doctorAccess } = require('../middleware/authMiddleware');

// // 🩺 Doctors can view all patients
// router.get('/', protect, doctorAccess, getPatients);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getPatients,
  getCurrentPatient,
  updatePatientProfile,
  updatePatientImage
} = require('../controllers/patientController');
const { protect, doctorAccess } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// 🩺 Doctors can view all patients
router.get('/', protect, doctorAccess, getPatients);

// 👤 Patient can view their own profile
router.get('/me', protect, getCurrentPatient);

// ✏️ Patient can update their name, phone, gender, age
router.patch('/update', protect, updatePatientProfile);

// 🖼️ Patient can update profile image
router.put('/profile-image', protect, upload.single('image'), updatePatientImage);

module.exports = router;
