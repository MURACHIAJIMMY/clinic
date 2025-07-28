

// // src/context/SocketContext.jsx
// import { createContext, useEffect, useRef } from 'react'
// import { io } from 'socket.io-client'
// import useAuth from '@/hooks/useAuth'

// const SocketContext = createContext(null)

// export function SocketProvider({ children }) {
//   const auth   = useAuth()
//   const user   = auth?.user ?? auth
//   const userId = user?._id || user?.id
//   const socketRef = useRef(null)

//   useEffect(() => {
//     if (!userId || socketRef.current) return

//     // 1) Compute your socket URL from VITE_API_URL
//     const SOCKET_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') 
//                       || 'http://localhost:5000'

//     // 2) Initialize Socket.IO with auth + CORS settings
//     socketRef.current = io(SOCKET_URL, {
//       path: '/socket.io',
//       transports: ['websocket'],     // force websocket
//       withCredentials: true,         // send cookies if any
//       auth: {
//         token: localStorage.getItem('token'),
//         userId,                      // optional: verify on server
//         role: user.role
//       }
//     })

//     socketRef.current.on('connect', () =>
//       console.log('🧠 Socket connected:', socketRef.current.id)
//     )

//     socketRef.current.on('connect_error', (err) =>
//       console.error('⚠️ Socket connect error:', err.message)
//     )

//     return () => {
//       socketRef.current.off()       // remove all listeners
//       socketRef.current.disconnect()
//       socketRef.current = null
//       console.log('🧹 Socket disconnected')
//     }
//   }, [userId, user.role])

//   return (
//     <SocketContext.Provider value={socketRef.current}>
//       {children}
//     </SocketContext.Provider>
//   )
// }

// export default SocketContext

// src/context/SocketContext.jsx
import { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import useAuth from '@/hooks/useAuth'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const auth   = useAuth()
  const user   = auth?.user ?? auth
  const userId = user?._id || user?.id

  // ↘ useState so updates cause re-render & re-provide socket
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!userId || socket) return

    const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') 
               || 'http://localhost:5000'
    const newSocket = io(BASE, {
      path: '/socket.io',
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: localStorage.getItem('token'),
        userId,
        role:  user.role,
      },
    })

    newSocket.on('connect', () =>
      console.log('🧠 Socket connected:', newSocket.id)
    )
    newSocket.on('connect_error', (err) =>
      console.error('⚠️ Socket connect error:', err.message)
    )

    setSocket(newSocket)

    return () => {
      newSocket.off()
      newSocket.disconnect()
      console.log('🧹 Socket disconnected')
      setSocket(null)
    }
  }, [userId, user.role, socket])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContext
