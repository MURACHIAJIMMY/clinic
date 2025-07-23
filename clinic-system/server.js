
// // server.js
//  require('dotenv').config();
//  const express           = require('express');
//  const cors              = require('cors');
//  const path              = require('path');
//  const connectDB         = require('./config/db');
//  const authRoutes        = require('./routes/authRoutes');
//  const doctorRoutes      = require('./routes/doctorRoutes');
//  const appointmentRoutes = require('./routes/appointmentRoutes');
//  const patientRoutes     = require('./routes/patientRoutes');
//  const chatRoutes        = require('./routes/chat');
// const userRoutes        = require('./routes/userRoutes');   // ← import

//  const startServer = async () => {
//    // 1) Connect to MongoDB
//    console.log('🔌 Connecting to MongoDB…');
//    await connectDB(process.env.MONGODB_URI);

//    // 2) Create Express app
//   console.log('🦄 STEP 6: Auth, Doctor, Appointment, Patient & Chat routes');
//   console.log('🦄 STEP 7: Auth, Doctor, Appointment, Patient, Chat & User routes');
//    const app = express();

//    // 3) CORS + JSON
//    const CLIENT_URL = process.env.CLIENT_URL;
//    app.use(cors({ origin: CLIENT_URL, credentials: true }));
//    app.use(express.json());

//    // 4) Static + Health
//    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//    app.get('/',   (_req, res) => res.send('Clinic System API is running…'));
//    app.post('/test', (_req, res) => res.json({ message: 'Test POST received!' }));

//    // 5) Mount authRoutes
//    console.log('🔗 Mounting authRoutes at /api/auth');
//    app.use('/api/auth', authRoutes);
//    console.log('✅ authRoutes mounted');

//    // 6) Mount doctorRoutes
//    console.log('🔗 Mounting doctorRoutes at /api/doctors');
//    app.use('/api/doctors', doctorRoutes);
//    console.log('✅ doctorRoutes mounted');

//    // 7) Mount appointmentRoutes
//    console.log('🔗 Mounting appointmentRoutes at /api/appointments');
//    app.use('/api/appointments', appointmentRoutes);
//    console.log('✅ appointmentRoutes mounted');

//    // 8) Mount patientRoutes
//    console.log('🔗 Mounting patientRoutes at /api/patients');
//    app.use('/api/patients', patientRoutes);
//    console.log('✅ patientRoutes mounted');

//    // 9) Mount chatRoutes
//    console.log('🔗 Mounting chatRoutes at /api/chat');
//    app.use('/api/chat', chatRoutes);
//    console.log('✅ chatRoutes mounted');

//  // 10) Mount userRoutes
//   console.log('🔗 Mounting userRoutes at /api/users');
//   app.use('/api/users', userRoutes);
//   console.log('✅ userRoutes mounted');

//    // 11) Start listening
//    const PORT = process.env.PORT || 5000;
//    app.listen(PORT, () =>
//      console.log(`✅ Server listening on port ${PORT}`)
//    );
//  };

//  startServer().catch(err => {
//    console.error('❌ Failed to start server:', err);
//    process.exit(1);
//  });

// server.js
require('dotenv').config();
const http    = require('http');
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { Server } = require('socket.io');

const connectDB         = require('./config/db');
const authRoutes        = require('./routes/authRoutes');
const doctorRoutes      = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const patientRoutes     = require('./routes/patientRoutes');
const chatRoutes        = require('./routes/chat');
const userRoutes        = require('./routes/userRoutes');

const startServer = async () => {
  // 1) Connect to MongoDB
  console.log('🔌 Connecting to MongoDB…');
  await connectDB(process.env.MONGODB_URI);

  // 2) Create Express app
  const app = express();

  // 3) CORS + JSON
  const CLIENT_URL = process.env.CLIENT_URL;
  app.use(cors({ origin: CLIENT_URL, credentials: true }));
  app.use(express.json());

  // 4) Static uploads & health checks
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  app.get('/', (_req, res) =>
    res.send('Clinic System API + Socket.IO is running…')
  );
  app.post('/test', (_req, res) =>
    res.json({ message: 'Test POST received!' })
  );

  // 5) Mount API routers
  console.log('🔗 Mounting authRoutes at /api/auth');
  app.use('/api/auth', authRoutes);

  console.log('🔗 Mounting doctorRoutes at /api/doctors');
  app.use('/api/doctors', doctorRoutes);

  console.log('🔗 Mounting appointmentRoutes at /api/appointments');
  app.use('/api/appointments', appointmentRoutes);

  console.log('🔗 Mounting patientRoutes at /api/patients');
  app.use('/api/patients', patientRoutes);

  console.log('🔗 Mounting chatRoutes at /api/chat');
  app.use('/api/chat', chatRoutes);

  console.log('🔗 Mounting userRoutes at /api/users');
  app.use('/api/users', userRoutes);

  // 6) Create HTTP server & attach Socket.IO
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    // Example: attach handlers here
    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
      console.log(`➡️ Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('sendMessage', (msg) => {
      // broadcast to room or user
      io.to(msg.roomId).emit('receiveMessage', msg);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });

  // 7) Start listening
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () =>
    console.log(`✅ Server + Socket.IO listening on port ${PORT}`)
  );
};

startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
