

// // server.js
// require('dotenv').config()

// const http        = require('http')
// const express     = require('express')
// const cors        = require('cors')
// const path        = require('path')
// const jwt         = require('jsonwebtoken')
// const { Server }  = require('socket.io')

// const connectDB         = require('./config/db')
// const User              = require('./Models/userModel')
// const Appointment       = require('./Models/appointmentModel')
// const ChatMessage       = require('./Models/chatModel')

// const authRoutes        = require('./routes/authRoutes')
// const doctorRoutes      = require('./routes/doctorRoutes')
// const appointmentRoutes = require('./routes/appointmentRoutes')
// const patientRoutes     = require('./routes/patientRoutes')
// const chatRoutes        = require('./routes/chat')
// const userRoutes        = require('./routes/userRoutes')

// const startServer = async () => {
//   // 1) Connect to MongoDB
//   await connectDB(process.env.MONGODB_URI)
//   console.log('🔌 MongoDB connected')

//   // 2) Create Express app
//   const app = express()

//   // 2a) CORS configuration – allow your front end and credentials
//   const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
//   app.use(
//     cors({
//       origin:      CLIENT_URL,
//       credentials: true,
//     })
//   )

//   // 2b) JSON parser & static uploads folder
//   app.use(express.json())
//   app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//   // 2c) Health check
//   app.get('/', (_req, res) =>
//     res.send('Clinic System API + Socket.IO is running…')
//   )

//   // 3) Mount REST API routers
//   app.use('/api/auth',        authRoutes)
//   app.use('/api/doctors',     doctorRoutes)
//   app.use('/api/appointments', appointmentRoutes)
//   app.use('/api/patients',    patientRoutes)
//   app.use('/api/chat',        chatRoutes)
//   app.use('/api/users',       userRoutes)

//   // 4) Create HTTP server & attach Socket.IO with matching CORS
//   const server = http.createServer(app)
//   const io = new Server(server, {
//     cors: {
//       origin:      CLIENT_URL,
//       methods:     ['GET', 'POST'],
//       credentials: true,
//     },
//   })

//   // 4a) Global socket connection errors
//   io.on('connection_error', (err) =>
//     console.error('❌ Global socket connection_error:', err.message)
//   )

//   // 5) Socket-level JWT authentication
//   io.use(async (socket, next) => {
//     console.log('🔎 handshake.auth →', socket.handshake.auth)
//     try {
//       const token = socket.handshake.auth?.token
//       if (!token) throw new Error('NO_TOKEN')

//       const { id: userId } = jwt.verify(token, process.env.JWT_SECRET)
//       const user = await User.findById(userId).select('-password')
//       if (!user) throw new Error('USER_NOT_FOUND')

//       socket.user = user
//       next()
//     } catch (err) {
//       console.error('🔒 Socket auth failed:', err.message)
//       next(new Error('Unauthorized'))
//     }
//   })

//   // 6) Handle socket events
//   io.on('connection', (socket) => {
//     console.log('🔌 Socket connected:', socket.id, socket.user._id)

//     socket.on('joinRoom', async ({ roomId }) => {
//       try {
//         const appt = await Appointment.findById(roomId)
//         if (!appt) throw new Error('APPOINTMENT_NOT_FOUND')

//         const uid = socket.user._id.toString()
//         if (uid !== appt.doctor.toString() && uid !== appt.patient.toString()) {
//           throw new Error('ACCESS_DENIED')
//         }

//         socket.join(roomId)
//         socket.emit('joinedRoom', { roomId })
//         console.log(`➡️ ${uid} joined room ${roomId}`)
//       } catch (err) {
//         console.warn('❌ joinRoom error:', err.message)
//         socket.emit('error', { message: err.message })
//       }
//     })

//     socket.on('sendMessage', async ({ roomId, text }) => {
//       try {
//         const appt = await Appointment.findById(roomId)
//         if (!appt) throw new Error('APPOINTMENT_NOT_FOUND')

//         const uid = socket.user._id.toString()
//         if (uid !== appt.doctor.toString() && uid !== appt.patient.toString()) {
//           throw new Error('ACCESS_DENIED')
//         }

//         const msg = await ChatMessage.create({
//           roomId,
//           sender:    uid,
//           message:   text,
//           timestamp: new Date(),
//           status:    'sent',
//         })

//         io.to(roomId).emit('receiveMessage', {
//           _id:       msg._id,
//           roomId:    msg.roomId,
//           senderId:  msg.sender.toString(),
//           text:      msg.message,
//           createdAt: msg.timestamp.toISOString(),
//         })
//       } catch (err) {
//         console.error('❌ sendMessage error:', err.message)
//         socket.emit('error', { message: err.message })
//       }
//     })

//     socket.on('typing', ({ roomId }) => {
//       if (socket.rooms.has(roomId)) {
//         socket.to(roomId).emit('typing', { userId: socket.user._id })
//       }
//     })

//     socket.on('stopTyping', ({ roomId }) => {
//       if (socket.rooms.has(roomId)) {
//         socket.to(roomId).emit('stopTyping', { userId: socket.user._id })
//       }
//     })

//     socket.on('disconnect', () =>
//       console.log('❌ Socket disconnected:', socket.id)
//     )
//   })

//   // 7) Start listening
//   const PORT = process.env.PORT || 5000
//   server.listen(PORT, () =>
//     console.log(`✅ Server + Socket.IO listening on port ${PORT}`)
//   )
// }

// startServer().catch((err) => {
//   console.error('❌ Server failed to start:', err)
//   process.exit(1)
// })
// server.js
// server.js
require('dotenv').config()

const http      = require('http')
const express   = require('express')
const cors      = require('cors')
const path      = require('path')
const jwt       = require('jsonwebtoken')
const { Server } = require('socket.io')

const connectDB         = require('./config/db')
const User              = require('./Models/userModel')
const Appointment       = require('./Models/appointmentModel')
const ChatMessage       = require('./Models/chatModel')

const authRoutes        = require('./routes/authRoutes')
const doctorRoutes      = require('./routes/doctorRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const patientRoutes     = require('./routes/patientRoutes')
const chatRoutes        = require('./routes/chat')
const userRoutes        = require('./routes/userRoutes')

const startServer = async () => {
  // 1) Connect to MongoDB
  await connectDB(process.env.MONGODB_URI)
  console.log('🔌 MongoDB connected')

  // 2) Create Express app
  const app = express()

  // 2a) CORS configuration
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
  app.use(
    cors({
      origin:      CLIENT_URL,
      credentials: true,
    })
  )

  // 2b) JSON parser & static uploads
  app.use(express.json())
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

  // 2c) Health check
  app.get('/', (_req, res) => {
    res.send('Clinic System API + Socket.IO is running…')
  })

  // 3) Mount API routers
  app.use('/api/auth',        authRoutes)
  app.use('/api/doctors',     doctorRoutes)
  app.use('/api/appointments', appointmentRoutes)
  app.use('/api/patients',    patientRoutes)
  app.use('/api/chat',        chatRoutes)
  app.use('/api/users',       userRoutes)

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) Serve front-end & SPA fallback
  const clientDistPath = path.join(__dirname, 'dist')
  app.use(express.static(clientDistPath))

  // Named wildcard with a valid regex (.*)
  app.get('/:splat(.*)', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
  // ─────────────────────────────────────────────────────────────────────────────

  // 5) HTTP server & Socket.IO
  const server = http.createServer(app)
  const io = new Server(server, {
    cors: {
      origin:      CLIENT_URL,
      methods:     ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io',
  })

  // 5a) Global socket errors
  io.on('connection_error', (err) =>
    console.error('❌ Global socket connection_error:', err.message)
  )

  // 6) Socket-level JWT auth
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      if (!token) throw new Error('NO_TOKEN')

      const { id: userId } = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(userId).select('-password')
      if (!user) throw new Error('USER_NOT_FOUND')

      socket.user = user
      next()
    } catch (err) {
      console.error('🔒 Socket auth failed:', err.message)
      next(new Error('Unauthorized'))
    }
  })

  // 7) Socket event handlers
  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id, socket.user._id)

    socket.on('joinRoom', async ({ roomId }) => {
      // … joinRoom logic …
    })

    socket.on('sendMessage', async ({ roomId, text }) => {
      // … sendMessage logic …
    })

    socket.on('typing', ({ roomId }) => {
      if (socket.rooms.has(roomId)) {
        socket.to(roomId).emit('typing', { userId: socket.user._id })
      }
    })

    socket.on('stopTyping', ({ roomId }) => {
      if (socket.rooms.has(roomId)) {
        socket.to(roomId).emit('stopTyping', { userId: socket.user._id })
      }
    })

    socket.on('disconnect', () =>
      console.log('❌ Socket disconnected:', socket.id)
    )
  })

  // 8) Launch
  const PORT = process.env.PORT || 5000
  server.listen(PORT, () =>
    console.log('✅ Server + Socket.IO listening on port ' + PORT)
  )
}

startServer().catch((err) => {
  console.error('❌ Server failed to start:', err)
  process.exit(1)
})
