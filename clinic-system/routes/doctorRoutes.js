
const express = require('express')
const upload = require('../middleware/uploadMiddleware')
const Doctor = require('../Models/doctorModel')
const { protect } = require('../middleware/authMiddleware')
const { getAllDoctors } = require('../controllers/doctorController')

const router = express.Router()

// 📋 Get all doctors with populated & flattened user fields
router.get('/', protect, getAllDoctors)

// 🧠 Get current doctor profile (for /doctors/me)
router.get('/me', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id })
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' })
    }
    res.status(200).json(doctor)
  } catch (err) {
    console.error('Error retrieving doctor profile:', err.message)
    res.status(500).json({ message: 'Server error retrieving doctor data' })
  }
})

// 🖼️ Upload doctor profile image
//    — store ONLY the filename, not the "uploads/" prefix
router.put(
  '/profile-image',
  protect,
  upload.single('image'),
  async (req, res) => {
    try {
      // Grab just the filename
      const filename = req.file.filename

      // Persist filename to the Doctor document
      const updated = await Doctor.findOneAndUpdate(
        { userId: req.user.id },
        { profileImage: filename },
        { new: true }
      )

      res.status(200).json({
        message: 'Doctor profile image updated successfully',
        profileImage: updated.profileImage,  // now just the filename
      })
    } catch (err) {
      console.error('Doctor image upload error:', err.message)
      res.status(500).json({ message: 'Server error uploading image' })
    }
  }
)

// 🔗 Get doctor by patient ID (for chat routing)
router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      patients: req.params.patientId,
    })
    if (!doctor) {
      return res.status(404).json({ message: 'Assigned doctor not found' })
    }
    res.status(200).json(doctor)
  } catch (err) {
    console.error('Error retrieving doctor for patient:', err.message)
    res.status(500).json({ message: 'Server error fetching doctor info' })
  }
})

module.exports = router
