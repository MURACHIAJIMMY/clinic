

import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Appointments from '@/pages/Appointments';
import Profile from '@/pages/Profile';
import Patients from '@/pages/Patients';
import BookAppointment from '@/pages/BookAppointment';
import UpcomingAppointments from '@/pages/UpcomingAppointments';
import AppointmentHistory from '@/pages/AppointmentHistory';
import PatientProfile from '@/pages/PatientProfile'; // ✅ NEW: Patient Profile page
import ChatPanel from '@/pages/ChatPanel';

// Route guards
import PrivateRoute from '@/components/ui/PrivateRoute';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <Appointments />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments/upcoming"
          element={
            <PrivateRoute>
              <UpcomingAppointments />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments/history"
          element={
            <PrivateRoute>
              <AppointmentHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivateRoute>
              <Patients />
            </PrivateRoute>
          }
        />
        <Route
          path="/book"
          element={
            <PrivateRoute>
              <BookAppointment />
            </PrivateRoute>
          }
        />

        <Route
          path="/PatientProfile"
          element={
            <PrivateRoute>
              <PatientProfile />
            </PrivateRoute>
          }
        />
        <Route
  path="/chat/:doctorId/:patientId"
  element={
    <PrivateRoute>
      <ChatPanel />
    </PrivateRoute>
  }
/>
      </Routes>
    </>
  );
}

export default App;
