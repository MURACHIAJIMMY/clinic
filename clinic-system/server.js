

// require('dotenv').config()                // Load .env variables first
// const express = require('express')
// const http = require('http')
// const { Server } = require('socket.io')
// const cors = require('cors')
// const path = require('path')

// const connectDB = require('./config/db')
// const chatRoutes = require('./routes/chat')
// const { saveMessage } = require('./controllers/chatController')

// // 1) Connect to MongoDB using the Atlas URI from .env
// const MONGODB_URI = process.env.MONGODB_URI
// connectDB(MONGODB_URI)

// const app = express()
// const server = http.createServer(app)

// // 2) Configure CORS to only allow your front-end origin
// const CLIENT_URL = process.env.CLIENT_URL  // e.g. http://localhost:5173
// const corsOptions = {
//   origin: CLIENT_URL,
//   methods: ['GET', 'POST'],
//   credentials: true
// }

// // 3) Middleware
// app.use(express.json())
// app.use(cors(corsOptions))
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// // 4) RESTful routes
// app.use('/api/doctors', require('./routes/doctorRoutes'))
// app.use('/api/auth', require('./routes/authRoutes'))
// app.use('/api/appointments', require('./routes/appointmentRoutes'))
// app.use('/api/users', require('./routes/userRoutes'))
// app.use('/api/patients', require('./routes/patientRoutes'))
// app.use('/api/chat', chatRoutes)

// app.post('/test', (req, res) => {
//   res.json({ message: 'Test POST request received!' })
// })

// app.get('/', (req, res) => {
//   res.send('Clinic System API is running...')
// })

// // 5) Request logger
// app.use((req, res, next) => {
//   console.log(`Received ${req.method} request at ${req.url}`)
//   console.log('Request body:', req.body)
//   next()
// })

// // 6) Initialize Socket.IO with the same CORS settings
// const io = new Server(server, { cors: corsOptions })

// io.on('connection', (socket) => {
//   console.log('🔌 Socket connected:', socket.id)

//   // Join a chat room
//   socket.on('joinRoom', ({ roomId }) => {
//     console.log('🧪 joinRoom event received:', roomId)
//     socket.join(roomId)
//     console.log(`📥 ${socket.id} joined room ${roomId}`)
//   })

//   // Handle incoming chat messages
//   socket.on('chatMessage', async ({ roomId, message, senderId, createdAt }) => {
//     const payload = { roomId, message, senderId, createdAt }
//     io.to(roomId).emit('chatMessage', payload)

//     try {
//       await saveMessage({ roomId, senderId, message, createdAt })
//     } catch (err) {
//       console.error('❌ Failed to save chat message:', err)
//     }
//   })

//   // Typing indicators
//   socket.on('typing', ({ roomId, userId }) => {
//     socket.to(roomId).emit('userTyping', { userId })
//   })
//   socket.on('stopTyping', ({ roomId, userId }) => {
//     socket.to(roomId).emit('userStoppedTyping', { userId })
//   })

//   // Doctor presence status
//   socket.on('doctorOnline', ({ doctorId }) => {
//     io.emit('doctorStatus', { doctorId, status: 'online' })
//   })

//   socket.on('disconnect', () => {
//     console.log('🔴 Socket disconnected:', socket.id)
//   })
// })

// // 7) Start server
// const PORT = process.env.PORT || 5000
// server.listen(PORT, () => {
//   console.log(`✅ Server + Socket.IO running on port ${PORT} 🚀`)
// })

require('dotenv').config()                // Load .env variables first

const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const path = require('path')

const connectDB = require('./config/db')
const chatRoutes = require('./routes/chat')
const authRoutes = require('./routes/authRoutes')

// 1) Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI
connectDB(MONGODB_URI)

// 2) Create Express + HTTP server
const app = express()
const server = http.createServer(app)

// 3) Configure CORS
const CLIENT_URL = process.env.CLIENT_URL
const corsOptions = {
  origin: CLIENT_URL,
  methods: ['GET', 'POST'],
  credentials: true
}

// 4) Middleware
app.use(express.json())
app.use(cors(corsOptions))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 5) Request logger (runs before all routes)
app.use((req, res, next) => {
  console.log(`🔎 ${req.method} ${req.url}`, req.body)
  next()
})

// 6) Mount RESTful routes
console.log('🔗 Mounting authRoutes at /api/auth')
app.use('/api/auth', authRoutes)
console.log('✅ authRoutes mounted')

app.use('/api/doctors',     require('./routes/doctorRoutes'))
app.use('/api/appointments', require('./routes/appointmentRoutes'))
app.use('/api/users',       require('./routes/userRoutes'))
app.use('/api/patients',    require('./routes/patientRoutes'))
app.use('/api/chat',        chatRoutes)

// 7) Test endpoint
app.post('/test', (req, res) => {
  res.json({ message: 'Test POST request received!' })
})

// 8) Root health check
app.get('/', (req, res) => {
  res.send('Clinic System API is running...')
})

// 9) Initialize Socket.IO
const io = new Server(server, { cors: corsOptions })

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id)

  socket.on('joinRoom', ({ roomId }) => {
    console.log('🧪 joinRoom event:', roomId)
    socket.join(roomId)
  })

  socket.on('chatMessage', async ({ roomId, message, senderId, createdAt }) => {
    io.to(roomId).emit('chatMessage', { roomId, message, senderId, createdAt })
    try {
      await require('./controllers/chatController').saveMessage({ roomId, senderId, message, createdAt })
    } catch (err) {
      console.error('❌ Failed to save message:', err)
    }
  })

  socket.on('typing', ({ roomId, userId }) => {
    socket.to(roomId).emit('userTyping', { userId })
  })
  socket.on('stopTyping', ({ roomId, userId }) => {
    socket.to(roomId).emit('userStoppedTyping', { userId })
  })

  socket.on('doctorOnline', ({ doctorId }) => {
    io.emit('doctorStatus', { doctorId, status: 'online' })
  })

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id)
  })
})

// 10) Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`✅ Server + Socket.IO running on port ${PORT} 🚀`)
})
