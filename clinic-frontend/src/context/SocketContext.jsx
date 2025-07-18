

import { createContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuth from '@/hooks/useAuth';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io('http://localhost:5000', {
        query: { userId: user._id, role: user.role },
      });

      socketRef.current.on('connect', () => {
        console.log('🧠 Socket connected with ID:', socketRef.current.id);
      });

      if (user.role === 'doctor') {
        socketRef.current.emit('doctorOnline', { doctorId: user._id });
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('🧹 Socket disconnected');
        socketRef.current = null;
      }
    };
    }, [user]);
  
    return (
      <SocketContext.Provider value={socketRef.current}>
        {children}
      </SocketContext.Provider>
    );
  };
 export default SocketProvider;