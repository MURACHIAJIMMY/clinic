

const express = require('express');
const Appointment = require('../Models/appointmentModel');
const {
  getAppointments,
  bookAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentById,
  getMyAppointments,
  searchAppointments,
  sortAppointments,
  paginateAppointments
} = require('../controllers/appointmentController');

const { protect, doctorAccess } = require('../middleware/authMiddleware');

const router = express.Router();

// 🔹 Patients: View their own appointments (MUST come before `/:id`)
router.get('/me', protect, getMyAppointments);

// 🔹 Search, sort, paginate (available to both roles)
router.get('/search', protect, searchAppointments);
router.get('/sort', protect, sortAppointments);
router.get('/paginate', protect, paginateAppointments);

// 🔹 Book appointment (patients only)
router.post('/', protect, bookAppointment);

// 🔹 Doctor-only endpoints
router.get('/', protect, doctorAccess, getAppointments);
router.get('/:id', protect, doctorAccess, getAppointmentById);
router.put('/:id', protect, doctorAccess, updateAppointment);
router.put('/:id/status', protect, doctorAccess, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: `Appointment ${status}`, appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, doctorAccess, deleteAppointment);

module.exports = router;
