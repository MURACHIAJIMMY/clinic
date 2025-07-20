// src/context/SocketContext.jsx

import { createContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import useAuth from '@/hooks/useAuth'

// 1) Create the context
const SocketContext = createContext(null)

// 2) Provider component
export function SocketProvider({ children }) {
  const auth = useAuth()
  const user = auth?.user ?? auth
  const userId = user?._id || user?.id
  const socketRef = useRef(null)

  useEffect(() => {
    if (userId && !socketRef.current) {
      socketRef.current = io('http://localhost:5000', {
        query: { userId, role: user.role }
      })
      socketRef.current.on('connect', () =>
        console.log('🧠 Socket connected:', socketRef.current.id)
      )
    }
    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
      console.log('🧹 Socket disconnected')
    }
  }, [userId, user.role])

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  )
}

// 3) Default export so "import SocketContext from '…'" works
export default SocketContext
