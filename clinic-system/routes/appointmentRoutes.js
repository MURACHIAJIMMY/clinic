// const express = require('express');
// const Appointment = require('../Models/appointmentModel'); // ✅ Import the model here
// const {
//     getAppointments,
//     bookAppointment,
//     updateAppointment,
//     deleteAppointment,
//     getAppointmentById,
//     searchAppointments,
//     sortAppointments,
//     paginateAppointments
// } = require('../controllers/appointmentController');

// const { protect, doctorAccess } = require('../middleware/authMiddleware'); // ✅ Import RBAC middleware

// const router = express.Router();

// // 🔹 Patients & doctors can search appointments by doctor name or date
// router.get('/search', protect, searchAppointments); // ✅ Only authenticated users can search

// // 🔹 Sort appointments by date
// router.get('/sort', protect, sortAppointments); // ✅ Restricted to logged-in users

// // 🔹 Paginate appointments
// router.get('/paginate', protect, paginateAppointments); // ✅ Only authenticated users

// // 🔹 Doctors can view all appointments
// router.get('/', protect, doctorAccess, getAppointments); // 🔥 Restricted to doctors

// // 🔹 Doctors can view specific appointments by ID
// router.get('/:id', protect, doctorAccess, getAppointmentById); // 🔥 Restricted to doctors

// const { getMyAppointments } = require('../controllers/appointmentController');

// router.get('/me', protect, getMyAppointments); // 🔹 Patients: View their own appointments

// // 🔹 Patients can book appointments (Doctors cannot)
// router.post('/', protect, bookAppointment); // 🔥 Restricted to patients

// // 🔹 Doctors can update appointment details (Patients cannot)
// router.put('/:id', protect, doctorAccess, updateAppointment); // 🔥 Restricted to doctors

// // 🔹 Doctors can approve or reject appointment status
// router.put('/:id/status', protect, doctorAccess, async (req, res) => {
//   try {
//     const { status } = req.body;
//     if (!['Confirmed', 'Cancelled'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status value' });
//     }

//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!appointment) {
//       return res.status(404).json({ message: 'Appointment not found' });
//     }

//     res.status(200).json({ message: `Appointment ${status}`, appointment });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // 🔹 Doctors can delete appointments if needed
// router.delete('/:id', protect, doctorAccess, deleteAppointment); // 🔥 Restricted to doctors

// module.exports = router;

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
