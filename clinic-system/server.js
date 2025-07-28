
// // server.js
// require('dotenv').config();
// const http    = require('http');
// const express = require('express');
// const cors    = require('cors');
// const path    = require('path');
// const { Server } = require('socket.io');

// const connectDB         = require('./config/db');
// const authRoutes        = require('./routes/authRoutes');
// const doctorRoutes      = require('./routes/doctorRoutes');
// const appointmentRoutes = require('./routes/appointmentRoutes');
// const patientRoutes     = require('./routes/patientRoutes');
// const chatRoutes        = require('./routes/chat');
// const userRoutes        = require('./routes/userRoutes');

// const startServer = async () => {
//   // 1) Connect to MongoDB
//   console.log('🔌 Connecting to MongoDB…');
//   await connectDB(process.env.MONGODB_URI);

//   // 2) Create Express app
//   const app = express();

//   // 3) CORS + JSON
//   const CLIENT_URL = process.env.CLIENT_URL;
//   app.use(cors({ origin: CLIENT_URL, credentials: true }));
//   app.use(express.json());

//   // 4) Static uploads & health checks
//   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//   app.get('/', (_req, res) =>
//     res.send('Clinic System API + Socket.IO is running…')
//   );
//   app.post('/test', (_req, res) =>
//     res.json({ message: 'Test POST received!' })
//   );

//   // 5) Mount API routers
//   console.log('🔗 Mounting authRoutes at /api/auth');
//   app.use('/api/auth', authRoutes);

//   console.log('🔗 Mounting doctorRoutes at /api/doctors');
//   app.use('/api/doctors', doctorRoutes);

//   console.log('🔗 Mounting appointmentRoutes at /api/appointments');
//   app.use('/api/appointments', appointmentRoutes);

//   console.log('🔗 Mounting patientRoutes at /api/patients');
//   app.use('/api/patients', patientRoutes);

//   console.log('🔗 Mounting chatRoutes at /api/chat');
//   app.use('/api/chat', chatRoutes);

//   console.log('🔗 Mounting userRoutes at /api/users');
//   app.use('/api/users', userRoutes);

//   // 6) Create HTTP server & attach Socket.IO
//   const server = http.createServer(app);
//   const io = new Server(server, {
//     cors: {
//       origin: CLIENT_URL,
//       methods: ['GET', 'POST'],
//       credentials: true
//     }
//   });

//   io.on('connection', (socket) => {
//     console.log('🔌 Socket connected:', socket.id);

//     // Example: attach handlers here
//     socket.on('joinRoom', ({ roomId }) => {
//       socket.join(roomId);
//       console.log(`➡️ Socket ${socket.id} joined room ${roomId}`);
//     });

//     socket.on('sendMessage', (msg) => {
//       // broadcast to room or user
//       io.to(msg.roomId).emit('receiveMessage', msg);
//     });

//     socket.on('disconnect', () => {
//       console.log('❌ Socket disconnected:', socket.id);
//     });
//   });

//   // 7) Start listening
//   const PORT = process.env.PORT || 5000;
//   server.listen(PORT, () =>
//     console.log(`✅ Server + Socket.IO listening on port ${PORT}`)
//   );
// };

// startServer().catch(err => {
//   console.error('❌ Failed to start server:', err);
//   process.exit(1);
// });

// server.js
require('dotenv').config();
const http           = require('http');
const express        = require('express');
const cors           = require('cors');
const path           = require('path');
const jwt            = require('jsonwebtoken');
const { Server }     = require('socket.io');

const connectDB      = require('./config/db');
const User           = require('./Models/userModel');
const Chat           = require('./Models/chatModel');
const Message        = require('./Models/messageModel');

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

  // 3) CORS & JSON body parsing
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

  // 5) Mount REST API routers
  app.use('/api/auth',        authRoutes);
  app.use('/api/doctors',     doctorRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/patients',    patientRoutes);
  app.use('/api/chat',        chatRoutes);
  app.use('/api/users',       userRoutes);

  // 6) Create HTTP server & attach Socket.IO
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // 7) Socket-level JWT authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error('NO_TOKEN_PROVIDED');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) throw new Error('USER_NOT_FOUND');

      socket.user = user;
      next();
    } catch (err) {
      console.error('🔒 Socket auth failed:', err.message);
      next(new Error('Unauthorized'));
    }
  });

  // 8) Handle socket connections
  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id, 'User:', socket.user._id);

    // Join a chat room (only if user is part of that chat)
    socket.on('joinRoom', async ({ roomId }) => {
      try {
        const chat = await Chat.findById(roomId);
        if (!chat) throw new Error('CHAT_NOT_FOUND');

        const allowed = chat.users.some(u => u.equals(socket.user._id));
        if (!allowed) throw new Error('ACCESS_DENIED');

        socket.join(roomId);
        socket.emit('joinedRoom', { roomId });
        console.log(`➡️ ${socket.user._id} joined room ${roomId}`);
      } catch (err) {
        console.warn('❌ joinRoom error:', err.message);
        socket.emit('error', { message: err.message });
      }
    });

    // Receive and broadcast chat message
    socket.on('sendMessage', async ({ roomId, text }) => {
      try {
        const chat = await Chat.findById(roomId);
        if (!chat) throw new Error('CHAT_NOT_FOUND');

        const allowed = chat.users.some(u => u.equals(socket.user._id));
        if (!allowed) throw new Error('ACCESS_DENIED');

        // Persist message
        const message = await Message.create({
          chat:   roomId,
          sender: socket.user._id,
          text
        });

        // Populate sender info
        await message.populate('sender', 'name _id');

        // Broadcast to room
        io.to(roomId).emit('receiveMessage', message);
      } catch (err) {
        console.error('❌ sendMessage error:', err.message);
        socket.emit('error', { message: err.message });
      }
    });

    // Typing indicator
    socket.on('typing', ({ roomId }) => {
      if (socket.rooms.has(roomId)) {
        socket.to(roomId).emit('typing', { userId: socket.user._id });
      }
    });

    // Stop typing indicator
    socket.on('stopTyping', ({ roomId }) => {
      if (socket.rooms.has(roomId)) {
        socket.to(roomId).emit('stopTyping', { userId: socket.user._id });
      }
    });

    // Clean up on disconnect
    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });

  // 9) Start listening
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () =>
    console.log(`✅ Server + Socket.IO listening on port ${PORT}`)
  );
};

startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
