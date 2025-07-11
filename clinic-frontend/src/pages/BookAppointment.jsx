


import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { FiBell } from 'react-icons/fi'; // Bell Icon

export default function BookAppointment() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState({
    patientName: user?.name || '',
    doctorName: '',
    date: '',
    time: '',
    reason: '',
  });
  const [appointments, setAppointments] = useState([]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/me');
      setAppointments(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not fetch appointments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', form);
      toast.success('Appointment booked!');
      setForm({
        patientName: user?.name || '',
        doctorName: '',
        date: '',
        time: '',
        reason: '',
      });
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.date) >= today
  );

  const hasSoonAppointment = upcomingAppointments.some((a) => {
    const daysLeft = (new Date(a.date) - today) / (1000 * 60 * 60 * 24);
    return daysLeft <= 3;
  });

  return (
    <div
      className="min-h-screen flex bg-cover bg-center bg-no-repeat px-4 py-10 relative"
      style={{ backgroundImage: "url('/bg-medical.jpg')" }}
    >
      {/* Top-right controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
        <Link to="/appointments/upcoming" title="View Upcoming Appointments">
          <FiBell
            size={36}
            className={`cursor-pointer ${
              hasSoonAppointment ? 'text-red-1000 animate-pulse' : 'text-green-1000'
            }`}
          />
        </Link>

        {/* Profile Picture */}
        {user?.profileImage ? (
          <img
           src={`http://localhost:5000/uploads/${user.profileImage}`}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-blue-500"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-black-400 flex items-center justify-center text-xs text-white-800">
            👨
          </div>
        )}

        <Button
          onClick={handleLogout}
          className="bg-black-800 text-grey-100 hover:bg-red-600"
        >
          Logout
        </Button>
      </div>

      {/* Left Sidebar Navigation */}
      <div className="flex flex-col gap-4 pt-4 pr-6">
        <Link
          to="/appointments/upcoming"
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded font-medium hover:bg-blue-200"
        >
          Upcoming Appointments
        </Link>
        <Link
          to="/appointments/history"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-medium hover:bg-gray-400"
        >
          Appointment History
        </Link>
        <Button
          asChild
          className="bg-yellow-100 text-yellow-800 hover:bg-green-400 px-4 py-2 rounded font-medium"
        >
          <Link to="/profile">Profile Settings</Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center w-full">
        {/* Centered Heading */}
        <div className="mb-10 text-center text-white">
          <h2 className="text-3xl font-bold">Welcome, {user?.name || 'Patient'} 👋</h2>
        </div>

        <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md p-6 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
            Book a New Appointment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Doctor Name</label>
              <input
                type="text"
                name="doctorName"
                value={form.doctorName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Reason</label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-300 w-full"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
