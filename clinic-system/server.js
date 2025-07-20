

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chat'); // ✅ Mounted correctly
const { saveMessage } = require('./controllers/chatController'); // ✅ Optional for future usage

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ RESTful Routes
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api', chatRoutes); // ✅ Routes for chatRoom and manual tests
app.post('/test', (req, res) => {
  res.json({ message: 'Test POST request received!' });
});

app.get('/', (req, res) => {
  res.send('Clinic System API is running...');
});

// ✅ Request Logger
app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// ✅ Socket.IO Events
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  // Join a room
  socket.on('joinRoom', ({ roomId }) => {
    console.log('🧪 joinRoom event received with roomId:', roomId);
    socket.join(roomId);
    console.log(`📥 ${socket.id} joined room ${roomId}`);
  });

  // Handle incoming messages
  socket.on('chatMessage', ({ roomId, message, senderId, createdAt }) => {
    const payload = { roomId, message, senderId, createdAt };
    io.to(roomId).emit('chatMessage', payload);
  });

  // Typing indicators
  socket.on('typing', ({ roomId, userId }) => {
    socket.to(roomId).emit('userTyping', { userId });
  });

  socket.on('stopTyping', ({ roomId, userId }) => {
    socket.to(roomId).emit('userStoppedTyping', { userId });
  });

  // Doctor presence status
  socket.on('doctorOnline', ({ doctorId }) => {
    io.emit('doctorStatus', { doctorId, status: 'online' });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server + Socket.IO running on port ${PORT} 🚀`);
});
