// server.js
require('dotenv').config()               // 1) Load .env variables

const express = require('express')
const http    = require('http')
const { Server } = require('socket.io')
const cors    = require('cors')
const path    = require('path')

const connectDB    = require('./config/db')
const authRoutes   = require('./routes/authRoutes')
const chatRoutes   = require('./routes/chat')
const doctorRoutes = require('./routes/doctorRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const userRoutes   = require('./routes/userRoutes')
const patientRoutes= require('./routes/patientRoutes')

// 2) Connect to MongoDB
connectDB(process.env.MONGODB_URI)

// 3) Create Express + HTTP server
const app    = express()
const server = http.createServer(app)

// 4) CORS setup (only once)
const CLIENT_URL = process.env.CLIENT_URL
const corsOptions = {
  origin:           CLIENT_URL,
  methods:          ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders:   ['Content-Type','Authorization'],
  credentials:      true
}
app.use(cors(corsOptions))
app.options('*', corsOptions)      // enable preflight across the board

// 5) Body parser
app.use(express.json())

// 6) Request logger
app.use((req, res, next) => {
  console.log(`🔎 ${req.method} ${req.url}`, req.body)
  next()
})

// 7) Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 8) Mount routers on literal paths
console.log('🔗 Mounting authRoutes at /api/auth')
app.use('/api/auth', authRoutes)

app.use('/api/doctors',      doctorRoutes)
app.use('/api/appointments',  appointmentRoutes)
app.use('/api/users',        userRoutes)
app.use('/api/patients',     patientRoutes)
app.use('/api/chat',         chatRoutes)

// 9) Health & test endpoints
app.get('/',    (_req, res) => res.send('Clinic System API is running…'))
app.post('/test', (_req, res) => res.json({ message: 'Test POST request received!' }))

// 10) Global error handler
app.use((err, _req, res, _next) => {
  console.error('❌ Express error:', err)
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal Server Error' })
})

// 11) Socket.IO
const io = new Server(server, { cors: corsOptions })
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id)
  // … your socket handlers …
})

// 12) Start listening
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`✅ Server + Socket.IO running on port ${PORT} 🚀`)
})
