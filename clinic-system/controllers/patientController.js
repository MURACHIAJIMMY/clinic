// const Patient = require('../Models/patientModel');

// const getPatients = async (req, res) => {
//   try {
//     const patients = await Patient.find().sort({ createdAt: -1 });
//     res.status(200).json(patients);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch patients' });
//   }
// };

// module.exports = { getPatients };


const Patient = require('../Models/patientModel');

// 🩺 Doctors: fetch all patients
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch patients' });
  }
};

// 👤 Get current patient's profile
const getCurrentPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (err) {
    console.error('Get patient error:', err.message);
    res.status(500).json({ message: 'Failed to get patient profile' });
  }
};

// 📝 Update patient profile fields
const updatePatientProfile = async (req, res) => {
  try {
    const { name, phone, gender, age } = req.body;

    const updated = await Patient.findOneAndUpdate(
      { userId: req.user.id },
      { name, phone, gender, age },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient profile updated', data: updated });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Failed to update patient profile' });
  }
};

// 📸 Upload patient profile image
const updatePatientImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imagePath = `uploads/${req.file.filename}`;

    const updated = await Patient.findOneAndUpdate(
      { userId: req.user.id },
      { profileImage: imagePath },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({
      message: 'Profile image updated successfully',
      profileImage: updated.profileImage
    });
  } catch (err) {
    console.error('Image upload error:', err.message);
    res.status(500).json({ message: 'Error uploading profile image' });
  }
};

module.exports = {
  getPatients,
  getCurrentPatient,
  updatePatientProfile,
  updatePatientImage
};
