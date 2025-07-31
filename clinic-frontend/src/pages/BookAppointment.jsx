
// src/pages/BookAppointment.jsx
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useNavigate, Navigate } from 'react-router-dom'
import api from '@/lib/axios'
import Button from '@/components/ui/button'
import { FiBell } from 'react-icons/fi'

export default function BookAppointment() {
  const navigate = useNavigate()
  const stored   = localStorage.getItem('user')
  const user     = stored ? JSON.parse(stored) : null
  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') 
                || 'http://localhost:5000'

  const [form, setForm]         = useState({
    patientName: user?.name || '',
    doctorName: '',
    date: '',
    time: '',
    reason: ''
  })
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors]           = useState([])
  const [loadingDocs, setLoadingDocs]   = useState(true)
  const [submitting, setSubmitting]     = useState(false)

  useEffect(() => {
    api.get('/appointments/me')
      .then(res => setAppointments(res.data))
      .catch(err =>
        toast.error(err.response?.data?.message || 'Could not fetch appointments')
      )

    api.get('/doctors')
      .then(res => setDoctors(res.data))
      .catch(() => toast.error('Failed to load doctors'))
      .finally(() => setLoadingDocs(false))
  }, [])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/appointments', form)
      toast.success('Appointment booked!')
      setForm({ patientName: user.name, doctorName: '', date: '', time: '', reason: '' })
      const res = await api.get('/appointments/me')
      setAppointments(res.data)
    } catch {
      toast.error('Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  const today    = new Date(); today.setHours(0,0,0,0)
  const upcoming = appointments.filter(a => new Date(a.date) >= today)
  const hasSoon  = upcoming.some(
    a => (new Date(a.date) - today) / 86400000 <= 3
  )
  const selectedDoc = doctors.find(d => d._id === form.doctorName)

  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-medical.jpg')" }}
    >
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 flex justify-end p-4 z-10 space-x-4">
        <FiBell
          size={30}
          className={hasSoon ? 'text-red-600 animate-bounce' : 'text-green-600'}
          onClick={() => navigate('/appointments/upcoming')}
          style={{ cursor: 'pointer' }}
        />

        {user.profileImage ? (
          <img
            src={`${API_BASE}/uploads/${user.profileImage}`}
            alt="Profile"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
            👤
          </div>
        )}

        <Button
          onClick={handleLogout}
          className="bg-gray-800 text-white hover:bg-red-600 py-1 px-3"
        >
          Logout
        </Button>
      </div>

      {/* Sidebar + Main (pushed down by pt-20) */}
      <div className="max-w-6xl mx-auto pt-20 mt-4 flex flex-col lg:flex-row gap-8 px-4">
        {/* Sidebar */}
        <aside className="w-full lg:w-60 flex flex-col items-center gap-4 p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
          <Button
            onClick={() => navigate('/appointments/upcoming')}
            className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Upcoming Appointments
          </Button>

          <Button
            onClick={() => navigate('/doctors')}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            view Doctors 👨‍⚕️
          </Button>

          <Button
            onClick={() => navigate('/appointments/history')}
            className="w-full py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Appointment History
          </Button>

          <Button
            onClick={() => navigate('/profile')}
            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Profile Settings
          </Button>
         
     {selectedDoc && (
  <Button
    onClick={() => {
      const matchingAppointment = upcoming.find(
        a => a.doctorName === selectedDoc._id
      )
      const appointmentId = matchingAppointment?._id || null

      navigate(`/chat/doctor_${selectedDoc._id}_patient_${user._id}`, {
        state: {
          patientId: user._id,
          appointmentId,
        },
      })
    }}
    className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
  >
    Chat with Dr. {selectedDoc.name}
  </Button>
)}

          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </Button>
        </aside>

        {/* Main booking card */}
        <main className="flex-1 flex flex-col items-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6 text-center w-full">
            Welcome, {user.name} 👋
          </h2>

          <div className="w-full max-w-md bg-white bg-opacity-90 p-6 rounded-lg shadow-xl">
            <h3 className="text-2xl font-semibold text-center mb-4">
              Book a New Appointment
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="doctorName"
                value={form.doctorName}
                onChange={handleChange}
                required
                disabled={loadingDocs}
                className="w-full p-2 border rounded"
              >
                <option value="" disabled>Select a doctor</option>
                {doctors.map(d => (
                  <option key={d._id} value={d._id}>
                    Dr. {d.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />

              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />

              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />

              <Button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {submitting ? 'Booking…' : 'Submit'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
