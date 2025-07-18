
// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App.jsx';
// import './index.css';
// import { SocketProvider } from '@/context/SocketContext';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <SocketProvider>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </SocketProvider>
//   </StrictMode>
// );



import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { SocketProvider } from '@/context/SocketContext';
import { AuthProvider } from '@/context/AuthContext'; // ✅ Add this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ Now routing hooks are available to all children */}
  <AuthProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
  </AuthProvider>
</BrowserRouter>

  </StrictMode>
);
