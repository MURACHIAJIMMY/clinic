

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useNavigate, Link } from 'react-router-dom'
import api from '@/lib/axios'
import Button from '@/components/ui/button'
import { FiBell } from 'react-icons/fi'

export default function BookAppointment() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const [form, setForm] = useState({
    patientName: user?.name || '',
    doctorName: '',
    date: '',
    time: '',
    reason: '',
  })
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/me')
      setAppointments(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not fetch appointments')
    }
  }

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors')
      setDoctors(res.data)
    } catch (err) {
      console.error('Error loading doctors:', err.message)
      toast.error('Failed to load doctors')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/appointments', form)
      toast.success('Appointment booked!')
      setForm({
        patientName: user?.name || '',
        doctorName: '',
        date: '',
        time: '',
        reason: '',
      })
      fetchAppointments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    }
  }

  useEffect(() => {
    fetchAppointments()
    fetchDoctors()
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.date) >= today
  )
  const hasSoonAppointment = upcomingAppointments.some((a) => {
    const daysLeft = (new Date(a.date) - today) / (1000 * 60 * 60 * 24)
    return daysLeft <= 3
  })

  const selectedDoctor = doctors.find((doc) => doc._id === form.doctorName)

  return (
    <div
      className="min-h-screen flex bg-cover bg-center bg-no-repeat px-4 py-10 relative"
      style={{ backgroundImage: "url('/bg-medical.jpg')" }}
    >
      {/* Top-right controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
        <Link to="/appointments/upcoming" title="View Upcoming Appointments">
          <FiBell
            size={34}
            className={`cursor-pointer ${
              hasSoonAppointment
                ? 'text-red-600 animate-bounce'
                : 'text-green-700'
            }`}
          />
        </Link>

        {user?.profileImage ? (
          <img
            src={`http://localhost:5000/uploads/${user.profileImage}`}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-blue-500"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white">
            👨
          </div>
        )}

        <Button
          onClick={handleLogout}
          className="bg-gray-800 text-white hover:bg-red-600 px-3 py-1 rounded"
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

        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => navigate('/doctors')}
        >
          👩‍⚕️ Browse All Doctors
        </Button>

        <Link
          to="/appointments/history"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-medium hover:bg-gray-400"
        >
          Appointment History
        </Link>

        {/* Replace asChild Button with Link-wrapped Button */}
        <Link to="/profile">
          <Button className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-4 py-2 rounded font-medium">
            Profile Settings
          </Button>
        </Link>

        {/* Chat Button for selected doctor */}
        {form.doctorName && (
          <Link
            to={`/chat/${selectedDoctor._id}/${user._id}`}
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            💬 Chat with Dr. {selectedDoctor?.name || 'Selected'}
          </Link>
        )}

        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-500"
        >
          Go to Dashboard
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center w-full">
        <div className="mb-10 text-center text-white">
          <h2 className="text-3xl font-bold">
            Welcome, {user?.name || 'Patient'} 👋
          </h2>
        </div>

        <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md p-6 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
            Book a New Appointment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Doctor Dropdown */}
            <div>
              <label className="block mb-1">Choose Doctor</label>
              <select
                name="doctorName"
                value={form.doctorName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="" disabled>
                  Select a doctor
                </option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.name}
                  </option>
                ))}
              </select>
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

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
