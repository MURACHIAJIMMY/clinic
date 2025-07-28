**JM Clinics Full-Stack System**
A tissue-thin landing page meets a robust backend and real-time chat. This repo powers JM Clinics’ marketing site and doctor–patient chat system built with React, Socket.IO, and Express.

**Table of Contents**

System Architecture

Real-Time Communication

Features

Tech Stack

Project Structure

Getting Started

Deployment

Future Improvements

Contributing

License

**System Architecture**

JM Clinics is split into two main services:

**1. clinic-frontend**

Built with Vite + React + Tailwind CSS

Hosts the marketing/booking site and doctor–patient chat UI

Connects to backend REST APIs and the Socket.IO server

**2. clinic-system**

Node.js + Express server

REST endpoints for authentication, appointments, user profiles

Socket.IO integration for real-time messaging

Mongoose models for Users, Messages, Appointments

Middleware for JWT auth, file uploads, error handling

At runtime:

React client (on /) fetches static HTML/CSS/JS from Vite dev server or /dist.

API calls (e.g. /api/auth/login, /api/appointments) hit Express routes.

On chat page, the Socket.IO client initializes:

Connects to https://api.jmclinics.com or local http://localhost:5000

Emits joinRoom with { patientId, doctorId }

Listens for message events and renders messages live.

Real-Time Communication

Socket.IO powers live chat between doctors and patients:

Client Side

io.connect(BACKEND_URL)

socket.emit('joinRoom', { roomId })

socket.on('message', saveToStateAndScroll())

sendMessage = (text) => socket.emit('chatMessage', { roomId, text })

Server Side

Attaches Socket.IO to Express HTTP server

io.on('connection', (socket) => { ... })

On joinRoom: socket.join(roomId)

On chatMessage:

Persist via Mongoose Message.create(...)

io.to(roomId).emit('message', formattedMsg)

Room & Presence

Each appointment or consultation has a unique roomId

Doctors and patients share the room for 1:1 messaging

Disconnects are broadcast so clients can mark users offline

Features
Landing Page: Hero, Services, About, Contact, smooth scroll

Responsive Navbar: Desktop links + mobile hamburger menu

Services Grid: General Medicine, Dental, Cardiology, Pediatrics, Neurology, Orthopedics

About Section: Team image + mission statement

Contact Section: Clickable WhatsApp, phone, email, LinkedIn, Facebook & map

Real-Time Chat: Secure doctor–patient messaging with Socket.IO

Authentication: JWT-based login/register APIs

File Uploads: Profile pics and attachments via multer

PWA Ready: Manifest + favicons for crisp icons

Tech Stack
Layer	Technology
Bundler	Vite
Frontend	React, React Router, Tailwind CSS
Real-Time	Socket.IO
Backend	Node.js, Express
Database	MongoDB via Mongoose
Authentication	JWT, bcrypt
File Uploads	multer
Deployment	Vercel / Netlify (frontend), Render
Project Structure
.
├── clinic-frontend
│   ├── public
│   │   ├── favicon-32x32.png
│   │   ├── favicon-64x64.png
│   │   ├── hero-bg.jpg
│   │   └── site.webmanifest
│   ├── src
│   │   ├── assets
│   │   │   └── logo.svg
│   │   ├── pages
│   │   │   └── Landing.jsx
│   │   ├── styles
│   │   │   └── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── clinic-system
    ├── config
    │   ├── db.js              # MongoDB connection
    │   └── default.json       # env vars
    │
    ├── controllers
    │   ├── authController.js
    │   ├── appointmentController.js
    │   └── chatController.js
    │
    ├── middleware
    │   ├── auth.js
    │   ├── errorHandler.js
    │   └── upload.js
    │
    ├── models
    │   ├── User.js
    │   ├── Appointment.js
    │   └── Message.js
    │
    ├── routes
    │   ├── auth.js
    │   ├── appointments.js
    │   └── chat.js
    │
    ├── uploads             # stored profile pics, attachments
    ├── server.js           # Express + Socket.IO init
    └── package.json
Getting Started
Prerequisites
Node.js v16+

npm or Yarn

MongoDB Atlas URI or local MongoDB

Install & Run
Clone repo

bash
git clone https://github.com/your-username/jm-clinics.git
cd jm-clinics
Setup backend

bash
cd clinic-system
npm install
cp config/default.json config/development.json
# Edit config/development.json with MONGO_URI, JWT_SECRET
npm run dev     # nodemon server.js
Setup frontend

bash
cd ../clinic-frontend
npm install
npm run dev     # launches Vite at http://localhost:5173
Deployment
clinic-frontend → Vercel, Netlify, or equivalent

clinic-system → Render, Heroku, or DigitalOcean

Ensure CORS and environment variables are locked down.

Socket.IO transport uses HTTPS/WSS in production.

Future Improvements
Add end-to-end tests (Cypress) for chat flows

“Typing…” indicators and read receipts in chat

Rich media support: file, image, voice notes

Doctor availability scheduling & video calls

Admin dashboard for monitoring conversations

Contributing
Fork the repo

Create a feature branch:

bash
git checkout -b feature/awesome-chat
Commit your changes and open a PR

We’ll review, test, and merge!

License
MIT © 2025 JM Clinics Feel free to reuse, modify, and distribute with attribution.
