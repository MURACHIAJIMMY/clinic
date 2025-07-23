// // server.js
// require('dotenv').config()               // Load .env first
// console.log('🦄 DEBUG: this is the updated server.js being executed')

// const express = require('express')
// const http    = require('http')
// const { Server } = require('socket.io')
// const cors    = require('cors')
// const path    = require('path')

// const connectDB      = require('./config/db')
// const authRoutes     = require('./routes/authRoutes')
// // const doctorRoutes   = require('./routes/doctorRoutes')
// // const appointmentRoutes = require('./routes/appointmentRoutes')
// // const userRoutes     = require('./routes/userRoutes')
// // const patientRoutes  = require('./routes/patientRoutes')
// // const chatRoutes     = require('./routes/chat')

// // 1) Connect to MongoDB
// connectDB(process.env.MONGODB_URI)

// // 2) Create Express + HTTP server
// const app    = express()
// const server = http.createServer(app)

// // 3) Configure CORS once, passing only middleware functions
// const CLIENT_URL = process.env.CLIENT_URL        // e.g. https://clinic-booking-br9y.onrender.com
// const corsOptions = {
//   origin:         CLIENT_URL,
//   credentials:    true,
//   methods:        ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization']
// }

// // register CORS
// app.use(cors(corsOptions))
// // handle preflight
// app.options('*', cors(corsOptions))

// // 4) Body parser
// app.use(express.json())

// // 5) Request logger
// app.use((req, res, next) => {
//   console.log(`🔎 ${req.method} ${req.url}`, req.body)
//   next()
// })

// // 6) Static uploads folder
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// // // 7) Mount your routers on literal paths only
// // console.log('🔗 Mounting authRoutes at /api/auth')
// app.use('/api/auth', authRoutes)
// // console.log('✅ authRoutes mounted')

// // app.use('/api/doctors',      doctorRoutes)
// // app.use('/api/appointments',  appointmentRoutes)
// // app.use('/api/users',        userRoutes)
// // app.use('/api/patients',     patientRoutes)
// // app.use('/api/chat',         chatRoutes)

// // 8) Health & Test endpoints
// app.get('/',   (_req, res) => res.send('Clinic System API is running…'))
// app.post('/test', (_req, res) => res.json({ message: 'Test POST request received!' }))

// // 9) Global error handler
// app.use((err, _req, res, _next) => {
//   console.error('❌ Express error:', err)
//   res.status(err.statusCode || 500).json({ message: err.message || 'Internal Server Error' })
// })

// // 10) Initialize Socket.IO with same CORS
// const io = new Server(server, { cors: corsOptions })
// io.on('connection', (socket) => {
//   console.log('🔌 Socket connected:', socket.id)
//   // … your socket handlers …
// })

// // 11) Start server
// const PORT = process.env.PORT || 5000
// server.listen(PORT, () => {
//   console.log(`✅ Server + Socket.IO running on port ${PORT} 🚀`)
// })

// server.js
require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/db');       // your DB helper
const authRoutes= require('./routes/authRoutes');

const startServer = async () => {
  // 1) Connect to MongoDB
  console.log('🔌 Connecting to MongoDB…');
  await connectDB(process.env.MONGODB_URI);

  // 2) Create Express app
  console.log('🦄 STEP 3: Auth routes');
  const app = express();

  // 3) CORS + JSON
  const CLIENT_URL = process.env.CLIENT_URL;
  app.use(cors({ origin: CLIENT_URL, credentials: true }));
  app.use(express.json());

  // 4) Static + Health
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  app.get('/',   (_req, res) => res.send('Clinic System API is running…'));
  app.post('/test', (_req, res) => res.json({ message: 'Test POST received!' }));

  // 5) Mount authRoutes
  console.log('🔗 Mounting authRoutes at /api/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ authRoutes mounted');

  // 6) Finally start listening
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`✅ STEP 3 listening on port ${PORT}`)
  );
};

startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
