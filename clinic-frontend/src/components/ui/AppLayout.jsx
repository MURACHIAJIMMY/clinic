

import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import PatientProfileRedirect from '@/components/PatientProfileRedirect'; // ✅ Import it here

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const user = useAuth(); // Get user info from token

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-sky-50">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-800 text-white px-6 py-8 space-y-5 shadow-lg border-r border-blue-900">
        <h2 className="text-2xl font-bold tracking-wide">Clinic System</h2>

        <nav className="space-y-3 text-sm">
          <a href="/dashboard" className="block hover:underline">Dashboard</a>
          <a href="/appointments" className="block hover:underline">Appointments</a>

          {user?.role === 'doctor' && (
            <a href="/patients" className="block hover:underline">Patients</a>
          )}
          {user?.role === 'patient' && (
            <a href="/book" className="block hover:underline">Book Appointment</a>
          )}

          <a href="/profile" className="block hover:underline">Profile</a>
        </nav>

        <button
          onClick={handleLogout}
          className="text-sm text-red-200 hover:underline mt-auto"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-12 lg:px-20 xl:px-28 py-10 bg-background text-foreground overflow-x-hidden">
        <PatientProfileRedirect /> {/* ✅ Injected here */}
        {children}
      </main>
    </div>
  );
}
