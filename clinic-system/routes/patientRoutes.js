
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

// 📡 Get Patients for a Specific Doctor (used for dashboard/chat routing)
router.get('/doctor/:doctorId', protect, doctorAccess, async (req, res) => {
  try {
    const patients = await require('../Models/patientModel').find({
      doctor: req.params.doctorId, // assumes patient has a "doctor" field
    });

    if (!patients || patients.length === 0) {
      return res.status(404).json({ message: 'No patients assigned to this doctor' });
    }

    res.status(200).json(patients);
  } catch (err) {
    console.error('❌ Error fetching patients for doctor:', err.message);
    res.status(500).json({ message: 'Server error retrieving patients' });
  }
});

module.exports = router;
