const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // ✅ Import path for static file serving
const connectDB = require('./config/db');

dotenv.config(); // ✅ Load environment variables
connectDB(); // ✅ Connect to MongoDB

const app = express();

// ✅ Middleware should come FIRST
app.use(express.json());
app.use(cors());

// ✅ Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ✅ File upload middleware
const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);


// ✅ Debugging: Log incoming requests for easy tracking
app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.url}`);
    console.log('Request body:', req.body);
    next();
});

// ✅ Base route
app.get('/', (req, res) => {
    res.send('Clinic System API is running...');
});

// ✅ Authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ✅ Appointment routes
const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

// ✅ 🆕 User routes (for role update and user profile update)
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// ✅ Patient routes
const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

// ✅ Test POST Route
app.post('/test', (req, res) => {
    res.json({ message: 'Test POST request received!' });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀🚀`));
