
// // server.js
// require('dotenv').config();

// const http      = require('http');
// const express   = require('express');
// const cors      = require('cors');
// const path      = require('path');
// const jwt       = require('jsonwebtoken');
// const { Server } = require('socket.io');

// const connectDB         = require('./config/db');
// const User              = require('./Models/userModel');

// const authRoutes        = require('./routes/authRoutes');
// const doctorRoutes      = require('./routes/doctorRoutes');
// const appointmentRoutes = require('./routes/appointmentRoutes');
// const patientRoutes     = require('./routes/patientRoutes');
// const chatRoutes        = require('./routes/chat');
// const userRoutes        = require('./routes/userRoutes');

// const startServer = async () => {
//   // 1) Connect to MongoDB
//   await connectDB(process.env.MONGODB_URI);
//   console.log('🔌 MongoDB connected');

//   // 2) Initialize Express and Middleware
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

//   // 3) Health Check
//   app.get('/', (_req, res) => {
//     res.send('Clinic System API + Socket.IO is running…');
//   });

//   // 4) API Routes (all under /api)
//   app.use('/api/auth',        authRoutes);
//   app.use('/api/doctors',     doctorRoutes);
//   app.use('/api/appointments', appointmentRoutes);
//   app.use('/api/patients',    patientRoutes);
//   app.use('/api/chat',        chatRoutes);
//   app.use('/api/users',       userRoutes);

//   // 5) Serve Frontend and SPA Fallback
//   const clientDist = path.join(__dirname, 'clinic-frontend','dist');
//   app.use(express.static(clientDist));

//   // Fallback: serve index.html for any non-API GET request
//   app.use((req, res, next) => {
//     if (
//       req.method === 'GET' &&
//       !req.path.startsWith('/api') &&
//       !req.path.includes('.')    // skip requests for static assets
//     ) {
//       return res.sendFile(path.join(clientDist, 'index.html'));
//     }
//     next();
//   });

//   // 6) HTTP Server + Socket.IO Setup
//   const server = http.createServer(app);
//   const io = new Server(server, {
//     cors: {
//       origin:      CLIENT_URL,
//       methods:     ['GET', 'POST'],
//       credentials: true
//     },
//     path: '/socket.io'
//   });

//   // 6a) Global Socket Error Handling
//   io.on('connection_error', err => {
//     console.error('❌ Socket connection_error:', err.message);
//   });

//   // 6b) Socket-Level JWT Auth
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

//   // 6c) Socket Event Handlers
//   io.on('connection', socket => {
//     console.log('🔌 Socket connected:', socket.id, socket.user._id);

//     socket.on('joinRoom', async ({ roomId }) => {
//       // … your joinRoom logic …
//     });

//     socket.on('sendMessage', async ({ roomId, text }) => {
//       // … your sendMessage logic …
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

//   // 7) Start Listening
//   const PORT = process.env.PORT || 5000;
//   server.listen(PORT, () => {
//     console.log('✅ Server + Socket.IO listening on port', PORT);
//   });
// };

// startServer().catch(err => {
//   console.error('❌ Server failed to start:', err);
//   process.exit(1);
// });

// server.js
require('dotenv').config();

const path      = require('path');
const express   = require('express');
const cors      = require('cors');
const http      = require('http');
const jwt       = require('jsonwebtoken');
const { Server } = require('socket.io');

const connectDB         = require('./config/db');
const User              = require('./Models/userModel');
const authRoutes        = require('./routes/authRoutes');
const doctorRoutes      = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const patientRoutes     = require('./routes/patientRoutes');
const chatRoutes        = require('./routes/chat');
const userRoutes        = require('./routes/userRoutes');

async function startServer() {
  // 1) Connect to MongoDB
  await connectDB(process.env.MONGODB_URI);
  console.log('🔌 MongoDB connected');

  // 2) Create Express app & middleware
  const app = express();
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

  app.use(
    cors({
      origin:      CLIENT_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // 3) Health check (under /api to avoid clashing with SPA)
  app.get('/api/health', (_req, res) => {
    res.send('OK');
  });

  // 4) Mount API routers
  app.use('/api/auth',        authRoutes);
  app.use('/api/doctors',     doctorRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/patients',    patientRoutes);
  app.use('/api/chat',        chatRoutes);
  app.use('/api/users',       userRoutes);

  // ─── 5) Socket.IO Setup ───────────────────────────────────────
  // Create HTTP server before mounting Socket.IO
  const server = http.createServer(app);
  const io = new Server(server, {
    path: '/socket.io',
    cors: {
      origin:      CLIENT_URL,
      methods:     ['GET', 'POST'],
      credentials: true,
    },
  });

  // 5a) Engine & connection error logging
  io.engine.on('connection_error', (err) =>
    console.error('❌ Socket engine connection_error:', err)
  );

  // 5b) Socket-level JWT authentication
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

  // 5c) Socket event handlers
  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);

    socket.on('joinRoom', async ({ roomId }) => {
      // … join logic …
    });

    socket.on('sendMessage', async ({ roomId, text }) => {
      // … send logic …
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

  // ─── 6) Serve Frontend & SPA Fallback ─────────────────────────
  const clientDist = path.join(__dirname, 'clinic-frontend', 'dist');
  app.use(express.static(clientDist));

  // Exclude API, socket.io, and asset requests from falling back
  app.get('*', (req, res, next) => {
    const isApi    = req.path.startsWith('/api');
    const isSocket = req.path.startsWith('/socket.io');
    const isAsset  = path.extname(req.path).length > 0;

    if (req.method === 'GET' && !isApi && !isSocket && !isAsset) {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });

  // 7) Start listening
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log('🚀 Server + Socket.IO listening on port', PORT);
  });
}

startServer().catch((err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});
