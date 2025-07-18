import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SocketContext from '@/context/SocketContext';
import useAuth from '@/hooks/useAuth';

export default function ChatPanel() {
  console.log('🧪 ChatPanel mounted');

  const socket = useContext(SocketContext);
  const auth = useAuth();
  const user = auth?.user;

  const { doctorId, patientId } = useParams();
  const roomId = `doctor_${doctorId}_patient_${patientId}`;

  // 🔍 Log each piece individually for step-by-step readiness tracking
  console.log('🧵 Socket ready:', !!socket);
  console.log('👤 User ready:', !!user);
  console.log('🆔 User ID ready:', !!user?._id);

  // ✅ Force strict boolean evaluation
  const ready = Boolean(socket) && Boolean(user) && Boolean(user._id);

  console.log('🔍 Full auth object:', auth);
  console.log('📦 roomId:', roomId);
  console.log('🙋‍♂️ user._id:', user?.userId || user?._id);
  console.log('🧠 doctorId:', doctorId);
  console.log('🩺 patientId:', patientId);
  console.log('✅ Ready status updated:', ready);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!ready) return;

    console.log('🚀 Emitting joinRoom with:', { roomId });
    socket.emit('joinRoom', { roomId });

    const handleMessage = (msg) => setMessages((prev) => [...prev, msg]);
    const handleTyping = ({ userId }) => {
      if (userId !== user._id) setIsTyping(true);
    };
    const handleStopTyping = ({ userId }) => {
      if (userId !== user._id) setIsTyping(false);
    };
    const handleReconnect = () => {
      console.log('🔁 Reconnected — rejoining room:', roomId);
      socket.emit('joinRoom', { roomId });
    };

    socket.on('chatMessage', handleMessage);
    socket.on('userTyping', handleTyping);
    socket.on('userStoppedTyping', handleStopTyping);
    socket.on('connect', handleReconnect);

    return () => {
      socket.off('chatMessage', handleMessage);
      socket.off('userTyping', handleTyping);
      socket.off('userStoppedTyping', handleStopTyping);
      socket.off('connect', handleReconnect);
    };
  }, [socket, user?._id, roomId, ready]);

  const sendMessage = () => {
    if (input.trim() && ready) {
      socket.emit('chatMessage', {
        roomId,
        message: input,
        senderId: user._id,
        createdAt: new Date().toISOString(),
      });
      setInput('');
    }
  };

  const handleTyping = () => {
    if (ready) {
      socket.emit('typing', { roomId, userId: user._id });
      setTimeout(() => {
        socket.emit('stopTyping', { roomId, userId: user._id });
      }, 2000);
    }
  };

  if (!ready) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center text-gray-600">
        Authenticating... Preparing your chat session.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold text-center mb-4">
        Doctor–Patient Live Chat
      </h2>

      <div className="h-64 overflow-y-auto border rounded p-2 mb-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded mb-2 max-w-[80%] ${
              msg.senderId === user._id
                ? 'ml-auto bg-blue-100 text-right'
                : 'mr-auto bg-gray-100 text-left'
            }`}
          >
            <p className="text-sm">{msg.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString()
                : 'Just now'}
            </p>
          </div>
        ))}
        {isTyping && (
          <p className="italic text-sm text-gray-500">Typing...</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
          placeholder="Type your message..."
          className="flex-grow border p-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
