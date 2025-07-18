

// const express = require('express');
// const upload = require('../middleware/uploadMiddleware');
// const Doctor = require('../Models/doctorModel');
// const { protect } = require('../middleware/authMiddleware');

// const router = express.Router();

// // 🧠 GET Current Doctor Profile (used by /doctors/me)
// router.get('/me', protect, async (req, res) => {
//   try {
//     const doctor = await Doctor.findOne({ userId: req.user.id });
//     if (!doctor) {
//       return res.status(404).json({ message: 'Doctor profile not found' });
//     }
//     res.status(200).json(doctor);
//   } catch (err) {
//     console.error('❌ Error retrieving doctor profile:', err.message);
//     res.status(500).json({ message: 'Server error retrieving doctor data' });
//   }
// });

// // 🖼️ Upload Doctor Profile Image
// router.put('/profile-image', protect, upload.single('image'), async (req, res) => {
//   try {
//     // 🔁 Normalize the file path for browser use
//     const normalizedPath = `uploads/${req.file.filename}`;

//     const updated = await Doctor.findOneAndUpdate(
//       { userId: req.user.id },
//       { profileImage: normalizedPath },
//       { new: true }
//     );

//     res.status(200).json({
//       message: 'Doctor profile image updated successfully',
//       profileImage: updated.profileImage,
//     });
//   } catch (err) {
//     console.error('❌ Doctor image upload error:', err.message);
//     res.status(500).json({ message: 'Server error uploading image' });
//   }
// });

// // 🔗 Get Doctor by Patient ID (for dynamic chat routing)
// router.get('/patient/:patientId', protect, async (req, res) => {
//   try {
//     const doctor = await Doctor.findOne({ patients: req.params.patientId }); // assumes doctor has a "patients" array
//     if (!doctor) {
//       return res.status(404).json({ message: 'Assigned doctor not found' });
//     }
//     res.status(200).json(doctor);
//   } catch (err) {
//     console.error('❌ Error retrieving doctor for patient:', err.message);
//     res.status(500).json({ message: 'Server error fetching doctor info' });
//   }
// });


// module.exports = router;


const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const Doctor = require('../Models/doctorModel');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// 🧠 GET Current Doctor Profile (used by /doctors/me)
router.get('/me', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    res.status(200).json(doctor);
  } catch (err) {
    console.error('❌ Error retrieving doctor profile:', err.message);
    res.status(500).json({ message: 'Server error retrieving doctor data' });
  }
});

// 🖼️ Upload Doctor Profile Image
router.put('/profile-image', protect, upload.single('image'), async (req, res) => {
  try {
    const normalizedPath = `uploads/${req.file.filename}`;

    const updated = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
      { profileImage: normalizedPath },
      { new: true }
    );

    res.status(200).json({
      message: 'Doctor profile image updated successfully',
      profileImage: updated.profileImage,
    });
  } catch (err) {
    console.error('❌ Doctor image upload error:', err.message);
    res.status(500).json({ message: 'Server error uploading image' });
  }
});

// 🔗 Get Doctor by Patient ID (for dynamic chat routing)
router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ patients: req.params.patientId });
    if (!doctor) {
      return res.status(404).json({ message: 'Assigned doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (err) {
    console.error('❌ Error retrieving doctor for patient:', err.message);
    res.status(500).json({ message: 'Server error fetching doctor info' });
  }
});

// 📋 Get All Doctors (for dropdown in appointment form)
router.get('/', protect, async (req, res) => {
  try {
    const doctors = await Doctor.find().select('_id name');
    res.status(200).json(doctors);
  } catch (err) {
    console.error('❌ Error fetching doctors list:', err.message);
    res.status(500).json({ message: 'Server error fetching doctors' });
  }
});

module.exports = router;
