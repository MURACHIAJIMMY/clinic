

// // src/context/SocketContext.jsx
// import { createContext, useEffect, useState } from 'react'
// import { io } from 'socket.io-client'
// import useAuth from '@/hooks/useAuth'

// const SocketContext = createContext(null)

// export function SocketProvider({ children }) {
//   const auth   = useAuth()
//   const user   = auth?.user ?? auth
//   const userId = user?._id || user?.id

//   // ↘ useState so updates cause re-render & re-provide socket
//   const [socket, setSocket] = useState(null)

//   useEffect(() => {
//     if (!userId || socket) return

//     const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') 
//                || 'http://localhost:5000'
//     const newSocket = io(BASE, {
//       path: '/socket.io',
//       transports: ['websocket'],
//       withCredentials: true,
//       auth: {
//         token: localStorage.getItem('token'),
//         userId,
//         role:  user.role,
//       },
//     })

//     newSocket.on('connect', () =>
//       console.log('🧠 Socket connected:', newSocket.id)
//     )
//     newSocket.on('connect_error', (err) =>
//       console.error('⚠️ Socket connect error:', err.message)
//     )

//     setSocket(newSocket)

//     return () => {
//       newSocket.off()
//       newSocket.disconnect()
//       console.log('🧹 Socket disconnected')
//       setSocket(null)
//     }
//   }, [userId, user.role, socket])

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   )
// }

// export default SocketContext
// src/context/SocketContext.jsx
import { createContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import useAuth from '@/hooks/useAuth'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const auth    = useAuth()
  const user    = auth?.user ?? auth
  const userId  = user?._id || user?.id
  const [socket, setSocket] = useState(null)
  const socketRef = useRef(null)

  useEffect(() => {
    // only run when we have a userId and no socket yet
    if (!userId || socketRef.current) return

    const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') 
               || 'http://localhost:5000'
    console.log('🔧 Socket BASE URL:', BASE)

    const newSocket = io(BASE, {
      path: '/socket.io',
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: localStorage.getItem('token'),
        userId,
        role: user.role,
      },
    })

    newSocket.on('connect', () =>
      console.log('🧠 Socket connected:', newSocket.id)
    )
    newSocket.on('connect_error', err =>
      console.error('⚠️ Socket connect_error:', err)
    )

    socketRef.current = newSocket
    setSocket(newSocket)

    return () => {
      newSocket.off()
      newSocket.disconnect()
      console.log('🧹 Socket disconnected')
      socketRef.current = null
      setSocket(null)
    }
  }, [userId, user.role])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContext
