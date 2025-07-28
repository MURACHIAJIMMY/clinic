

const Appointment = require('../Models/appointmentModel');
const Patient = require('../Models/patientModel'); // ✅ Needed for doctor assignment

// 🧠 Get appointment by ID
const getAppointmentById = async (req, res) => {
  let { id } = req.params;
  id = id.trim();

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid appointment ID format' });
  }

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching appointment by ID:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get all appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// 📅 Book a new appointment with rigid doctor sync
const bookAppointment = async (req, res) => {
  const { doctorName, date, time, reason } = req.body;

  if (!doctorName || !date || !time || !reason) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newAppointment = new Appointment({
      patientId: req.user._id,
      patientName: req.user.name,
      doctorName,
      date,
      time,
      reason,
      status: 'Pending',
    });

    await newAppointment.save();

    // 🔒 Rigid sync: only assign doctor if none exists
    await Patient.findOneAndUpdate(
      { userId: req.user._id, doctor: { $exists: false } },
      { doctor: doctorName }
    );

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error saving appointment:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ Delete appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Search appointments
const searchAppointments = async (req, res) => {
  console.log('Received Query:', req.query);

  let { doctorName, date } = req.query;
  doctorName = doctorName?.trim();
  date = date?.trim();

  let filter = {};
  if (doctorName) {
    filter.doctorName = { $regex: new RegExp(doctorName, 'i') };
  }
  if (date) {
    filter.date = date;
  }

  try {
    const appointments = await Appointment.find(filter);
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error searching appointments:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ↕️ Sort appointments
const sortAppointments = async (req, res) => {
  let { sortBy, order } = req.query;
  sortBy = sortBy?.trim();
  order = order?.trim();

  const validFields = ['date', 'doctorName', 'createdAt'];
  if (!validFields.includes(sortBy)) {
    return res.status(400).json({ message: `Invalid sort field: ${sortBy}` });
  }

  const sortOption = { [sortBy]: order === 'desc' ? -1 : 1 };

  try {
    const appointments = await Appointment.find()
      .collation({ locale: 'en', strength: 2 })
      .sort(sortOption);
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error sorting appointments:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// 📄 Paginate appointments
const paginateAppointments = async (req, res) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  if (page < 1 || limit < 1) {
    return res.status(400).json({ message: 'Invalid pagination values' });
  }

  try {
    const appointments = await Appointment.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await Appointment.countDocuments();

    res.status(200).json({
      totalAppointments: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      appointments,
    });
  } catch (error) {
    console.error('Error paginating appointments:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// 📦 Get user’s own appointments with cleanup
const getMyAppointments = async (req, res) => {
  try {
    const allAppointments = await Appointment.find({ patientId: req.user._id });

    const today = new Date();
    const threshold = new Date(today.setDate(today.getDate() - 30));

    const expired = allAppointments.filter(
      (appt) => appt.status === 'Confirmed' && new Date(appt.date) < threshold
    );

    await Promise.all(expired.map((appt) => Appointment.findByIdAndDelete(appt._id)));

    const filtered = allAppointments.filter(
      (appt) => !(appt.status === 'Confirmed' && new Date(appt.date) < threshold)
    );

    res.status(200).json(filtered);
  } catch (error) {
    console.error('Error fetching user appointments:', error.message);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
};

module.exports = {
  getAppointments,
  bookAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentById,
  searchAppointments,
  sortAppointments,
  paginateAppointments,
  getMyAppointments,
};
