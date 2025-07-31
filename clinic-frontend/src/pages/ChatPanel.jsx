
// // src/pages/ChatPanel.jsx
// import { useContext, useEffect, useState, useRef } from 'react'
// import { useParams, useNavigate, useLocation } from 'react-router-dom'
// import SocketContext from '@/context/SocketContext'
// import useAuth from '@/hooks/useAuth'
// import api from '@/lib/axios'

// export default function ChatPanel() {
//   const navigate  = useNavigate()
//   const location  = useLocation()
//   const auth      = useAuth()
//   const user      = auth?.user ?? auth
//   const userId    = user?._id || user?.id

//   const { roomId } = useParams()
//   const {
//     patientId: statePatientId,
//     appointmentId,
//   } = location.state || {}

//   const parts = roomId?.split('_')
//   const decodedDoctorId  = parts[1]
//   const decodedPatientId = parts[3]

//   const doctorId  = decodedDoctorId
//   const patientId = statePatientId || decodedPatientId

//   const socket = useContext(SocketContext)
//   const ready  = Boolean(socket) && Boolean(userId)

//   const [messages, setMessages]   = useState([])
//   const [input, setInput]         = useState('')
//   const [isTyping, setIsTyping]   = useState(false)
//   const [patientInfo, setPatientInfo] = useState(null)

//   const scrollRef         = useRef(null)
//   const typingTimeoutRef  = useRef(null)

//   useEffect(() => {
//     api.get(`/chat/rooms/${roomId}/messages`)
//       .then(res => {
//         const msgs = Array.isArray(res.data)
//           ? res.data
//           : Array.isArray(res.data.messages)
//             ? res.data.messages
//             : []
//         setMessages(msgs)
//       })
//       .catch(err => {
//         console.error('❌ Message fetch failed:', err)
//         setMessages([])
//       })
//   }, [roomId])

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   useEffect(() => {
//     if (!ready) return

//     console.log('🧩 Emitting joinRoom with:', {
//       roomId,
//       doctorId,
//       patientId,
//       appointmentId,
//       userId
//     })

//     socket.emit('joinRoom', {
//       roomId,
//       doctorId,
//       patientId,
//       appointmentId,
//     })

//     const addMsg = msg => {
//       console.log('📩 Received:', msg)
//       setMessages(prev => [...prev, msg])
//     }

//     const startTyping = ({ userId: who }) => {
//       console.log('✏️ Typing started by:', who)
//       if (who !== userId) setIsTyping(true)
//     }

//     const stopTyping = ({ userId: who }) => {
//       console.log('✏️ Typing stopped by:', who)
//       if (who !== userId) setIsTyping(false)
//     }

//     const onReconnect = () => {
//       socket.emit('joinRoom', { roomId, doctorId, patientId, appointmentId })
//     }

//     socket.on('receiveMessage', addMsg)
//     socket.on('typing',         startTyping)
//     socket.on('stopTyping',     stopTyping)
//     socket.on('connect',        onReconnect)

//     return () => {
//       socket.off('receiveMessage', addMsg)
//       socket.off('typing',         startTyping)
//       socket.off('stopTyping',     stopTyping)
//       socket.off('connect',        onReconnect)
//     }
//   }, [socket, userId, roomId, ready, doctorId, patientId, appointmentId])

//   // 🧠 Fetch Patient Info
//   useEffect(() => {
//     if (!patientId || user?.role !== 'doctor') return;

//     api.get(`/users/${patientId}`)
//       .then(res => {
//         setPatientInfo(res.data)
//       })
//       .catch(err => {
//         console.error('❌ Failed to fetch patient info:', err)
//       })
//   }, [patientId, user?.role])

//   const sendMessage = () => {
//     if (!input.trim()) return

//     socket.emit('sendMessage', {
//       roomId,
//       text: input.trim(),
//     })
//     setInput('')
//   }

//   const handleType = e => {
//     setInput(e.target.value)
//     socket.emit('typing', { roomId, userId })

//     clearTimeout(typingTimeoutRef.current)
//     typingTimeoutRef.current = setTimeout(() =>
//       socket.emit('stopTyping', { roomId, userId }),
//       2000
//     )
//   }

//   if (!ready) {
//     return <div className="p-4 text-center">Loading chat…</div>
//   }

//   return (
//     <div className="chat-panel max-w-2xl mx-auto p-4 bg-white shadow rounded">
//       <button
//         onClick={() => navigate('/dashboard')}
//         className="btn-go-back mb-4 px-2 py-1 bg-blue-300 rounded hover:bg-blue-400"
//       >
//         ↩️ Back to Dashboard
//       </button>

//       {patientInfo?.name && (
//         <div className="text-center text-gray-700 text-sm mb-2">
//           Chatting with: <strong>{patientInfo.name}</strong>
//         </div>
//       )}

//       <h2 className="text-center mb-4">
//         Chat (Appointment: {appointmentId})
//       </h2>

//       <div className="messages h-64 bg-yellow-100 overflow-auto border p-2 mb-2">
//         {messages.map((m, i) => {
//           const senderId = m?.sender?._id || m?.senderId || m?.user
//           const mine = senderId === userId

//           return (
//             <div key={i} className={`msg ${mine ? 'mine' : 'theirs'}`}>
//               <p>{m.text || m.message}</p>
//               <small>{new Date(m.createdAt || m.timestamp).toLocaleTimeString()}</small>
//             </div>
//           )
//         })}
//         {isTyping && <p className="italic">Typing…</p>}
//         <div ref={scrollRef} />
//       </div>

//       <div className="flex gap-2">
//         <input
//           value={input}
//           onChange={handleType}
//           placeholder="Type a message…"
//           className="flex-grow border p-2 rounded"
//         />
//         <button
//           onClick={sendMessage}
//           className="btn-send px-4 py-2 bg-green-300 rounded hover:bg-green-400"
//         >
//           Send
//         </button>
//       </div>

//       {/* 🔍 Debug Info */}
//       <div className="text-xs mt-3 bg-gray-100 p-2 rounded">
//         <strong>Socket:</strong> {socket?.id}<br />
//         <strong>Room:</strong> {roomId}<br />
//         <strong>User:</strong> {user?.name} ({user?.role})
//       </div>
//     </div>
//   )
// }

import { useContext, useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import SocketContext from '@/context/SocketContext'
import useAuth from '@/hooks/useAuth'
import api from '@/lib/axios'

export default function ChatPanel() {
  const navigate     = useNavigate()
  const location     = useLocation()
  const auth         = useAuth()
  const user         = auth?.user ?? auth
  const userId       = user?._id || user?.id
  const socket       = useContext(SocketContext)
  const { roomId }   = useParams()
  const { patientId: statePatientId, appointmentId } = location.state || {}

  const [messages, setMessages]       = useState([])
  const [input, setInput]             = useState('')
  const [isTyping, setIsTyping]       = useState(false)
  const [patientInfo, setPatientInfo] = useState(null)

  const scrollRef        = useRef(null)
  const typingTimeoutRef = useRef(null)

  const parts = roomId?.split('_') || []
  const decodedDoctorId  = parts[1]
  const decodedPatientId = parts[3]
  const doctorId         = decodedDoctorId
  const patientId        = statePatientId || decodedPatientId
  const validRoom        = Boolean(decodedDoctorId && decodedPatientId)
  const ready            = Boolean(socket && userId)

  // 📨 Reset + fetch messages
  useEffect(() => {
    if (!validRoom) return
    setMessages([])
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
        setMessages([])
      })
  }, [roomId, validRoom])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ⚡ Join socket room
  useEffect(() => {
    if (!ready || !validRoom) return

    console.log('🧩 Emitting joinRoom with:', {
      roomId, doctorId, patientId, appointmentId, userId
    })

    socket.emit('joinRoom', { roomId, doctorId, patientId, appointmentId })

    const addMsg = msg => {
      console.log('📩 Received:', msg)
      setMessages(prev => [...prev, msg])
    }

    const startTyping = ({ userId: who }) => {
      if (who !== userId) setIsTyping(true)
    }

    const stopTyping = ({ userId: who }) => {
      if (who !== userId) setIsTyping(false)
    }

    const onReconnect = () => {
      socket.emit('joinRoom', { roomId, doctorId, patientId, appointmentId })
    }

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
  }, [socket, userId, roomId, ready, doctorId, patientId, appointmentId, validRoom])

  // 🧠 Fetch Patient Info (if doctor)
  useEffect(() => {
    if (!patientId || !user?.role || user.role !== 'doctor') return

    api.get(`/users/${patientId}`)
      .then(res => {
        setPatientInfo(res.data)
      })
      .catch(err => {
        console.error('❌ Failed to fetch patient info:', err)
      })
  }, [patientId, user?.role])

  const sendMessage = () => {
    if (!input.trim()) return

    socket.emit('sendMessage', {
      roomId,
      text: input.trim(),
    })
    setInput('')
  }

  const handleType = e => {
    setInput(e.target.value)
    socket.emit('typing', { roomId, userId })

    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() =>
      socket.emit('stopTyping', { roomId, userId }),
      2000
    )
  }

  // 🔒 Handle loading or invalid room UI safely
  if (!validRoom) {
    return (
      <div className="p-4 text-center">
        ❌ Invalid chat room ID. <br />
        <button onClick={() => navigate('/dashboard')} className="mt-2 px-3 py-1 bg-blue-300 rounded hover:bg-blue-400">
          Go back to dashboard
        </button>
      </div>
    )
  }

  if (!ready) {
    return <div className="p-4 text-center">Loading chat…</div>
  }

  return (
    <div className="chat-panel max-w-2xl mx-auto p-4 bg-white shadow rounded">
      <button
        onClick={() => navigate('/dashboard')}
        className="btn-go-back mb-4 px-2 py-1 bg-blue-300 rounded hover:bg-blue-400"
      >
        ↩️ Back to Dashboard
      </button>

      {patientInfo?.name && (
        <div className="text-center text-gray-700 text-sm mb-2">
          Chatting with: <strong>{patientInfo.name}</strong>
        </div>
      )}

      <h2 className="text-center mb-4">
        Chat (Appointment: {appointmentId})
      </h2>

      <div className="messages h-64 bg-yellow-100 overflow-auto border p-2 mb-2">
        {messages.map((m, i) => {
          const senderId = m?.sender?._id || m?.senderId || m?.user
          const mine = senderId === userId
          const senderName = mine ? 'You' : m?.sender?.name || 'Unknown'

          return (
            <div key={i} className={`msg ${mine ? 'mine' : 'theirs'} mb-2`}>
              <p className="font-semibold">{senderName}:</p>
              <p>{m.text || m.message}</p>
              <small>
                {new Date(m.createdAt || m.timestamp).toLocaleTimeString([], {
                  hour: '2-digit', minute: '2-digit'
                })}
              </small>
            </div>
          )
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

      {/* 🔍 Debug Info */}
      <div className="text-xs mt-3 bg-gray-100 p-2 rounded">
        <strong>Socket:</strong> {socket?.id}<br />
        <strong>Room:</strong> {roomId}<br />
        <strong>User:</strong> {user?.name} ({user?.role})
      </div>
    </div>
  )
}
