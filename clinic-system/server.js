

// // server.js
// require('dotenv').config();

// const http        = require('http');
// const express     = require('express');
// const cors        = require('cors');
// const path        = require('path');
// const jwt         = require('jsonwebtoken');
// const { Server }  = require('socket.io');

// const connectDB           = require('./config/db');
// const User                = require('./Models/userModel');
// const authRoutes          = require('./routes/authRoutes');
// const doctorRoutes        = require('./routes/doctorRoutes');
// const appointmentRoutes   = require('./routes/appointmentRoutes');
// const patientRoutes       = require('./routes/patientRoutes');
// const chatRoutes          = require('./routes/chat');
// const userRoutes          = require('./routes/userRoutes');

// async function startServer() {
//   // 1) Connect to MongoDB
//   await connectDB(process.env.MONGODB_URI);
//   console.log('🔌 MongoDB connected');

//   // 2) Initialize Express & middleware
//   const app = express();
//   const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

//   app.use(
//     cors({
//       origin:      CLIENT_URL,
//       credentials: true
//     })
//   );
//   app.use(express.json());
//   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//   // 3) Health check
//   app.get('/', (_req, res) => {
//     res.send('Clinic System API + Socket.IO is running…');
//   });

//   // 4) API routes (all under /api)
//   app.use('/api/auth',        authRoutes);
//   app.use('/api/doctors',     doctorRoutes);
//   app.use('/api/appointments', appointmentRoutes);
//   app.use('/api/patients',    patientRoutes);
//   app.use('/api/chat',        chatRoutes);
//   app.use('/api/users',       userRoutes);

//   // 5) Serve frontend static assets
//   const clientDist = path.join(__dirname, 'clinic-frontend', 'dist');
//   app.use(express.static(clientDist));

//   // 6) SPA fallback: serve index.html for non-API GETs without file extension
//   app.use((req, res, next) => {
//     if (
//       req.method === 'GET' &&
//       !req.path.startsWith('/api') &&
//       !req.path.includes('.')
//     ) {
//       return res.sendFile(path.join(clientDist, 'index.html'));
//     }
//     next();
//   });

//   // 7) Create HTTP server & attach Socket.IO
//   const server = http.createServer(app);
//   const io = new Server(server, {
//     path: '/socket.io',
//     cors: {
//       origin:      CLIENT_URL,
//       methods:     ['GET', 'POST'],
//       credentials: true
//     }
//   });

//   // 7a) Socket engine errors
//   io.engine.on('connection_error', err => {
//     console.error('❌ Socket connection_error:', err.message);
//   });

//   // 7b) JWT authentication for sockets
//   io.use(async (socket, next) => {
//     try {
//       const token = socket.handshake.auth?.token;
//       if (!token) throw new Error('NO_TOKEN');

//       const payload = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(payload.id).select('-password');
//       if (!user) throw new Error('USER_NOT_FOUND');

//       socket.user = user;
//       next();
//     } catch (err) {
//       console.error('🔒 Socket auth failed:', err.message);
//       next(new Error('Unauthorized'));
//     }
//   });

//   // 7c) Socket event handlers
//   io.on('connection', socket => {
//     console.log('🔌 Socket connected:', socket.id, socket.user._id);

//     socket.on('joinRoom', async ({ roomId }) => {
//       socket.join(roomId);
//     });

//     socket.on('sendMessage', async ({ roomId, text }) => {
//       io.to(roomId).emit('receiveMessage', {
//         user: socket.user._id,
//         text,
//         timestamp: Date.now()
//       });
//     });

//     socket.on('typing', ({ roomId }) => {
//       if (socket.rooms.has(roomId)) {
//         socket.to(roomId).emit('typing', { userId: socket.user._id });
//       }
//     });

//     socket.on('stopTyping', ({ roomId }) => {
//       if (socket.rooms.has(roomId)) {
//         socket.to(roomId).emit('stopTyping', { userId: socket.user._id });
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('❌ Socket disconnected:', socket.id);
//     });
//   });

//   // 8) Start the server
//   const PORT = process.env.PORT || 5000;
//   server.listen(PORT, () => {
//     console.log('✅ Server + Socket.IO listening on port', PORT);
//   });
// }

// startServer().catch(err => {
//   console.error('❌ Server failed to start:', err);
//   process.exit(1);
// });

// server.js
require('dotenv').config();

const http        = require('http');
const express     = require('express');
const cors        = require('cors');
const path        = require('path');
const jwt         = require('jsonwebtoken');
const { Server }  = require('socket.io');

const connectDB           = require('./config/db');
const User                = require('./Models/userModel');
const ChatMessage         = require('./Models/chatModel'); // 👈 NEW import
const authRoutes          = require('./routes/authRoutes');
const doctorRoutes        = require('./routes/doctorRoutes');
const appointmentRoutes   = require('./routes/appointmentRoutes');
const patientRoutes       = require('./routes/patientRoutes');
const chatRoutes          = require('./routes/chat');
const userRoutes          = require('./routes/userRoutes');

async function startServer() {
  await connectDB(process.env.MONGODB_URI);
  console.log('🔌 MongoDB connected');

  const app = express();
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

  app.use(cors({ origin: CLIENT_URL, credentials: true }));
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.get('/', (_req, res) => {
    res.send('Clinic System API + Socket.IO is running…');
  });

  app.use('/api/auth',        authRoutes);
  app.use('/api/doctors',     doctorRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/patients',    patientRoutes);
  app.use('/api/chat',        chatRoutes);
  app.use('/api/users',       userRoutes);

  const clientDist = path.join(__dirname, 'clinic-frontend', 'dist');
  app.use(express.static(clientDist));

  app.use((req, res, next) => {
    if (
      req.method === 'GET' &&
      !req.path.startsWith('/api') &&
      !req.path.includes('.')
    ) {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });

  const server = http.createServer(app);
  const io = new Server(server, {
    path: '/socket.io',
    cors: {
      origin:      CLIENT_URL,
      methods:     ['GET', 'POST'],
      credentials: true
    }
  });

  io.engine.on('connection_error', err => {
    console.error('❌ Socket connection_error:', err.message);
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error('NO_TOKEN');

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select('-password');
      if (!user) throw new Error('USER_NOT_FOUND');

      socket.user = user;
      next();
    } catch (err) {
      console.error('🔒 Socket auth failed:', err.message);
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', socket => {
    console.log('🔌 Socket connected:', socket.id, socket.user._id);

    socket.on('joinRoom', ({ roomId }) => {
      console.log(`🚪 ${socket.user.name} joined room ${roomId}`);
      socket.join(roomId);
    });

    socket.on('sendMessage', async ({ roomId, text }) => {
      try {
        const saved = await ChatMessage.create({
          roomId,
          sender: socket.user._id,
          message: text,
          timestamp: new Date()
        });

        io.to(roomId).emit('receiveMessage', {
          sender: { _id: saved.sender },
          message: saved.message,
          createdAt: saved.timestamp.toISOString()
        });
      } catch (err) {
        console.error('💾 Failed to save message:', err.message);
      }
    });

    socket.on('typing', ({ roomId }) => {
      if (socket.rooms.has(roomId)) {
        socket.to(roomId).emit('typing', { userId: socket.user._id });
      }
    });

    socket.on('stopTyping', ({ roomId }) => {
      if (socket.rooms.has(roomId)) {
        socket.to(roomId).emit('stopTyping', { userId: socket.user._id });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log('✅ Server + Socket.IO listening on port', PORT);
  });
}

startServer().catch(err => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});
