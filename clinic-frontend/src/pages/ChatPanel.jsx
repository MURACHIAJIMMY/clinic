

import { useContext, useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SocketContext from '@/context/SocketContext'
import useAuth from '@/hooks/useAuth'

export default function ChatPanel() {
  const navigate = useNavigate()
  const auth = useAuth()
  const user = auth?.user ?? auth
  const userId = user?._id || user?.id

  const { doctorId, patientId } = useParams()
  const roomId = `doctor_${doctorId}_patient_${patientId}`

  const socket = useContext(SocketContext)
  const ready  = Boolean(socket) && Boolean(userId)

  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)

  // A) Load past messages once
  useEffect(() => {
    fetch(`/api/chat/rooms/${roomId}/messages`)
      .then(res => res.json())
      .then(setMessages)
      .catch(console.error)
  }, [roomId])

  // B) Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // C) Join & subscribe live events
  useEffect(() => {
    if (!ready) return

    socket.emit('joinRoom', { roomId })
    const addMsg      = msg => setMessages(prev => [...prev, msg])
    const startTyping = ({ userId: who }) =>
      who !== userId && setIsTyping(true)
    const stopTyping  = ({ userId: who }) =>
      who !== userId && setIsTyping(false)
    const onReconnect = () =>
      socket.emit('joinRoom', { roomId })

    socket.on('chatMessage', addMsg)
    socket.on('userTyping', startTyping)
    socket.on('userStoppedTyping', stopTyping)
    socket.on('connect', onReconnect)

    return () => {
      socket.off('chatMessage', addMsg)
      socket.off('userTyping', startTyping)
      socket.off('userStoppedTyping', stopTyping)
      socket.off('connect', onReconnect)
    }
  }, [socket, userId, roomId, ready])

  if (!ready) {
    return <div className="p-4 text-center">Loading chat…</div>
  }

  // D) Send / typing handlers
  const sendMessage = () => {
    if (!input.trim()) return
    socket.emit('chatMessage', {
      roomId,
      message:  input,
      senderId: userId,
      createdAt:new Date().toISOString(),
    })
    setInput('')
  }

  let timeoutId
  const handleType = e => {
    setInput(e.target.value)
    socket.emit('typing', { roomId, userId })
    clearTimeout(timeoutId)
    timeoutId = setTimeout(
      () => socket.emit('stopTyping', { roomId, userId }),
      2000
    )
  }

  return (
    <div className="chat-panel max-w-2xl mx-auto p-4 bg-white shadow rounded">
      {/* ← Back to Dashboard */}
      <button
        onClick={() => navigate('/dashboard')}
        // className="mb-4 text-blue-600 hover:underline"
        className="btn-go back text-white-800 px-2 py-2 bg-blue-300 rounded hover:bg-purple-400"
      >
        ↩️ Back to Dashboard
      </button>

      <h2 className="text-center mb-4">Doctor–Patient Live Chat</h2>

      <div className="messages h-74 bg-yellow-100 overflow-auto border p-2 mb-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`msg ${m.senderId === userId ? 'mine' : 'theirs'}`}
          >
            <p>{m.message}</p>
            <small>{new Date(m.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
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
