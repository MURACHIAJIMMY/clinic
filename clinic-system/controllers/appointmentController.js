const Appointment = require('../Models/appointmentModel');

// get appoint by id 
const getAppointmentById = async (req, res) => {
    let { id } = req.params;

    id = id.trim(); // 🔹 Remove unwanted spaces or newline characters

    if (!id.match(/^[0-9a-fA-F]{24}$/)) { 
        return res.status(400).json({ message: 'Invalid appointment ID format' });
    }

    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error fetching appointment by ID:', error.message);
        res.status(500).json({ message: error.message });
    }
};




// Get all appointments
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error.message);
        res.status(500).json({ message: error.message });
    }
};


// Book a new appointment

const bookAppointment = async (req, res) => {
  const { doctorName, date, time, reason } = req.body;

  if (!doctorName || !date || !time || !reason) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newAppointment = new Appointment({
      patientId: req.user._id,           // 🔹 link to the user
      patientName: req.user.name,        // 🔹 user’s name from token
      doctorName,
      date,
      time,
      reason,
      status: 'Pending',
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error saving appointment:', error.message);
    res.status(500).json({ message: error.message });
  }
};


// Update an appointment (status or details)
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


// Delete an appointment
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
// search appointments by doctor name or date
const searchAppointments = async (req, res) => {
    console.log('Received Query:', req.query);

    let { doctorName, date } = req.query;

    // 🔹 Trim values to remove accidental spaces or newline characters
    doctorName = doctorName?.trim();
    date = date?.trim();

    let filter = {};
    if (doctorName) {
        filter.doctorName = { $regex: new RegExp(doctorName, 'i') }; // Case-insensitive regex
    }
    if (date) {
        filter.date = date;
    }

    console.log('Filter applied:', filter);

    try {
        const appointments = await Appointment.find(filter);
        console.log('Results found:', appointments);
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error searching appointments:', error.message);
        res.status(500).json({ message: error.message });
    }
};
// sort appointments by date
const sortAppointments = async (req, res) => {
    let { sortBy, order } = req.query;

    // 🔹 Trim and validate query parameters
    sortBy = sortBy?.trim();
    order = order?.trim();

    let validFields = ['date', 'doctorName', 'createdAt']; // Allowed sorting fields

    // 🔹 Ensure sorting field is valid
    if (!validFields.includes(sortBy)) {
        return res.status(400).json({ message: `Invalid sort field: ${sortBy}` });
    }

    let sortOption = {};
    sortOption[sortBy] = order === 'desc' ? -1 : 1;

    console.log('Sorting by:', sortOption); // 🔹 Debug sorting query

    try {
        const appointments = await Appointment.find().collation({ locale: "en", strength: 2 }).sort(sortOption);
        console.log('Sorted results:', appointments);
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error sorting appointments:', error.message);
        res.status(500).json({ message: error.message });
    }
};
// pagenating appointments 
const paginateAppointments = async (req, res) => {
    let { page, limit } = req.query;

    // 🔹 Convert query parameters to numbers & set defaults
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 🔹 Ensure values are positive numbers
    if (page < 1 || limit < 1) {
        return res.status(400).json({ message: 'Invalid pagination values' });
    }

    try {
        const appointments = await Appointment.find()
            .skip((page - 1) * limit) // 🔹 Skip records based on the page
            .limit(limit); // 🔹 Limit the number of records

        const totalCount = await Appointment.countDocuments(); // 🔹 Count total appointments

        res.status(200).json({
            totalAppointments: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            appointments
        });

    } catch (error) {
        console.error('Error paginating appointments:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// const getMyAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ patientId: req.user._id });
//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error('Error fetching user appointments:', error.message);
//     res.status(500).json({ message: 'Server error fetching appointments' });
//   }
// };

const getMyAppointments = async (req, res) => {
  try {
    const allAppointments = await Appointment.find({ patientId: req.user._id });

    // 🔍 Remove confirmed appointments older than 30 days
    const today = new Date();
    const threshold = new Date(today.setDate(today.getDate() - 30));

    const expired = allAppointments.filter(
      (appt) =>
        appt.status === 'Confirmed' && new Date(appt.date) < threshold
    );

    // 🔄 Delete them from DB
    await Promise.all(
      expired.map((appt) => Appointment.findByIdAndDelete(appt._id))
    );

    // 🚿 Return fresh results
    const filtered = allAppointments.filter(
      (appt) =>
        !(appt.status === 'Confirmed' && new Date(appt.date) < threshold)
    );

    res.status(200).json(filtered);
  } catch (error) {
    console.error('Error fetching user appointments:', error.message);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
};


module.exports = { getAppointments, bookAppointment, updateAppointment, deleteAppointment,getAppointmentById,searchAppointments,sortAppointments,paginateAppointments, getMyAppointments };

