

import { useContext, useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import SocketContext from '@/context/SocketContext'
import useAuth from '@/hooks/useAuth'
import api from '@/lib/axios'


export default function ChatPanel() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const auth      = useAuth()
  const user      = auth?.user ?? auth
  const userId    = user?._id || user?.id

  // 1) Get single route param:
  const { roomId } = useParams()

  // 2) Grab any state we passed:
  const {
    patientId: statePatientId,
    appointmentId,
  } = location.state || {}

  // 3) Decode doctorId & patientId from roomId if state missing:
  //    roomId format: "doctor_<doctorId>_patient_<patientId>"
  const parts = roomId.split('_')
  const decodedDoctorId  = parts[1]
  const decodedPatientId = parts[3]

  const doctorId  = decodedDoctorId
  const patientId = statePatientId || decodedPatientId

  const socket = useContext(SocketContext)
  const ready  = Boolean(socket) && Boolean(userId)

  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef               = useRef(null)
  const typingTimeoutRef        = useRef(null)

  // A) Load past messages once
  // useEffect(() => {
  //   const API = import.meta.env.VITE_API_URL
  //   fetch(`${API}/api/chat/rooms/${roomId}/messages`)
  //     .then(res => res.json())
  //     .then(setMessages)
  //     .catch(console.error)
  // }, [roomId])
useEffect(() => {
  api.get(`/chat/rooms/${roomId}/messages`)
    .then(res => {
      const msgs = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.messages)
          ? res.data.messages
          : []

      setMessages(msgs)
    })
    .catch(err => {
      console.error('❌ Message fetch failed:', err)
      setMessages([]) // fallback to empty array
    })
}, [roomId])

  // B) Auto-scroll on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // C) Join room & subscribe to live events
  useEffect(() => {
    if (!ready) return

    socket.emit('joinRoom', {
      roomId,
      doctorId,
      patientId,
      appointmentId,
    })

    const addMsg      = msg => setMessages(prev => [...prev, msg])
    const startTyping = ({ userId: who }) =>
      who !== userId && setIsTyping(true)
    const stopTyping  = ({ userId: who }) =>
      who !== userId && setIsTyping(false)
    const onReconnect = () =>
      socket.emit('joinRoom', { roomId, doctorId, patientId, appointmentId })

    socket.on('receiveMessage', addMsg)
    socket.on('typing',         startTyping)
    socket.on('stopTyping',     stopTyping)
    socket.on('connect',        onReconnect)

    return () => {
      socket.off('receiveMessage', addMsg)
      socket.off('typing',         startTyping)
      socket.off('stopTyping',     stopTyping)
      socket.off('connect',        onReconnect)
    }
  }, [
    socket,
    userId,
    roomId,
    ready,
    doctorId,
    patientId,
    appointmentId,
  ])

  // D) Send message
  const sendMessage = () => {
    if (!input.trim()) return

    socket.emit('sendMessage', {
      roomId,
      text: input.trim(),
    })

    setInput('')
  }

  // E) Typing indicator
  const handleType = e => {
    setInput(e.target.value)
    socket.emit('typing', { roomId, userId })

    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(
      () => socket.emit('stopTyping', { roomId, userId }),
      2000
    )
  }

  if (!ready) {
    return (
      <div className="p-4 text-center">
        Loading chat…
      </div>
    )
  }

  return (
    <div className="chat-panel max-w-2xl mx-auto p-4 bg-white shadow rounded">
      <button
        onClick={() => navigate('/appointments')}
        className="btn-go-back mb-4 px-2 py-1 bg-blue-300 rounded hover:bg-blue-400"
      >
        ↩️ Back to Appointments
      </button>

      <h2 className="text-center mb-4">
        Chat (Appointment: {appointmentId})
      </h2>

      <div className="messages h-64 bg-yellow-100 overflow-auto border p-2 mb-2">
        {/* {messages.map((m, i) => (
          <div
            key={i}
            className={`msg ${m.sender._id === userId ? 'mine' : 'theirs'}`}
          >
            <p>{m.text || m.message}</p>
            <small>{new Date(m.createdAt).toLocaleTimeString()}</small>
          </div>
        ))} */}
        {messages.map((m, i) => {
  const senderId = m?.sender?._id || m?.senderId || m?.user;
  const mine     = senderId === userId;

  return (
    <div key={i} className={`msg ${mine ? 'mine' : 'theirs'}`}>
      <p>{m.text || m.message}</p>
      <small>{new Date(m.createdAt || m.timestamp).toLocaleTimeString()}</small>
    </div>
  );
})}

        {isTyping && <p className="italic">Typing…</p>}
        <div ref={scrollRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={handleType}
          placeholder="Type a message…"
          className="flex-grow border p-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="btn-send px-4 py-2 bg-green-300 rounded hover:bg-green-400"
        >
          Send
        </button>
      </div>
    </div>
  )
}
