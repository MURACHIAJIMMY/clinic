
// import { useState, useEffect } from 'react'
// import { toast } from 'sonner'
// import { useNavigate, Link, Navigate } from 'react-router-dom'
// import api from '@/lib/axios'
// import Button from '@/components/ui/button'
// import { FiBell } from 'react-icons/fi'

// export default function BookAppointment() {
//   const navigate = useNavigate()
//   const stored = localStorage.getItem('user')
//   const user   = stored ? JSON.parse(stored) : null
//   const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

//   const [form,       setForm]       = useState({ patientName: user?.name || '', doctorName: '', date: '', time: '', reason: '' })
//   const [appointments, setAppointments] = useState([])
//   const [doctors,     setDoctors]     = useState([])
//   const [loadingDocs, setLoadingDocs] = useState(true)
//   const [submitting,  setSubmitting]  = useState(false)

//   useEffect(() => {
//     api.get('/appointments/me')
//       .then(res => setAppointments(res.data))
//       .catch(err => toast.error(err.response?.data?.message || 'Could not fetch appointments'))

//     api.get('/doctors')
//       .then(res => setDoctors(res.data))
//       .catch(() => toast.error('Failed to load doctors'))
//       .finally(() => setLoadingDocs(false))
//   }, [])

//   if (!user) return <Navigate to="/login" replace />

//   const handleChange = e =>
//     setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     toast.success('Logged out successfully')
//     navigate('/login')
//   }

//   const handleSubmit = async e => {
//     e.preventDefault()
//     setSubmitting(true)
//     try {
//       await api.post('/appointments', form)
//       toast.success('Appointment booked!')
//       setForm({ patientName: user.name, doctorName: '', date: '', time: '', reason: '' })
//       // refresh
//       const res = await api.get('/appointments/me')
//       setAppointments(res.data)
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Booking failed')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const today = new Date(); today.setHours(0,0,0,0)
//   const upcoming = appointments.filter(a => new Date(a.date) >= today)
//   const hasSoon = upcoming.some(a => (new Date(a.date) - today)/(1000*60*60*24) <= 3)
//   const selectedDoc = doctors.find(d => d._id === form.doctorName)

//   return (
//     <div className="min-h-screen relative bg-cover bg-center px-4 py-10" style={{ backgroundImage:"url('/bg-medical.jpg')" }}>
//       {/* Top controls */}
//       <div className="absolute top-6 right-6 flex items-center gap-4">
//         <Link to="/appointments/upcoming" title="View Upcoming Appointments">
//           <FiBell size={34} className={hasSoon ? 'text-red-600 animate-bounce' : 'text-green-700'} />
//         </Link>
//         {user.profileImage
//           ? <img src={`${API_BASE}/uploads/${user.profileImage}`} alt="Profile" className="w-8 h-8 rounded-full" />
//           : <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">👨</div>
//         }
//         <Button onClick={handleLogout} className="bg-gray-800 text-white hover:bg-red-600">Logout</Button>
//       </div>

//       {/* Sidebar */}
//       <aside className="flex flex-col gap-4 pt-4 pr-6">
//         <Link to="/appointments/upcoming" className="…">Upcoming Appointments</Link>
//         <Button onClick={() => navigate('/doctors')} className="…">Browse Doctors</Button>
//         <Link to="/appointments/history" className="…">Appointment History</Link>
//         <Link to="/profile"><Button className="…">Profile Settings</Button></Link>
//         {selectedDoc && (
//           <Link to={`/chat/${selectedDoc._id}/${user._id}`} className="…">
//             Chat with Dr. {selectedDoc.name}
//           </Link>
//         )}
//         <Link to="/dashboard" className="…">Go to Dashboard</Link>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 flex flex-col items-center w-full">
//         <h2 className="text-3xl font-bold text-white mb-10">Welcome, {user.name} 👋</h2>
//         <div className="w-full max-w-md bg-white bg-opacity-90 p-6 rounded shadow-md">
//           <h2 className="text-2xl font-semibold text-center mb-4">Book a New Appointment</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <select name="doctorName" value={form.doctorName} onChange={handleChange} required className="w-full p-2 border rounded" disabled={loadingDocs}>
//               <option value="" disabled>Select a doctor</option>
//               {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
//             </select>
//             <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full p-2 border rounded" />
//             <input type="time" name="time" value={form.time} onChange={handleChange} required className="w-full p-2 border rounded" />
//             <textarea name="reason" value={form.reason} onChange={handleChange} required className="w-full p-2 border rounded" />
//             <Button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white">
//               {submitting ? 'Booking…' : 'Submit'}
//             </Button>
//           </form>
//         </div>
//       </main>
//     </div>
//   )
// }

// src/pages/BookAppointment.jsx
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import api from '@/lib/axios'
import Button from '@/components/ui/button'
import { FiBell } from 'react-icons/fi'

export default function BookAppointment() {
  const navigate = useNavigate()
  const stored = localStorage.getItem('user')
  const user   = stored ? JSON.parse(stored) : null
  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') 
                || 'http://localhost:5000'

  const [form, setForm] = useState({
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
      .catch(err => toast.error(err.response?.data?.message || 'Could not fetch appointments'))

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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date(); today.setHours(0,0,0,0)
  const upcoming = appointments.filter(a => new Date(a.date) >= today)
  const hasSoon = upcoming.some(
    a => (new Date(a.date) - today) / (1000 * 60 * 60 * 24) <= 3
  )
  const selectedDoc = doctors.find(d => d._id === form.doctorName)

  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-medical.jpg')" }}
    >
      {/* Top controls */}
      <div className="absolute inset-x-0 top-0 flex justify-end p-4 z-10 space-x-4">
        <Link to="/appointments/upcoming" title="View Upcoming">
          <FiBell
            size={30}
            className={hasSoon ? 'text-red-600 animate-bounce' : 'text-green-600'}
          />
        </Link>
        {user.profileImage ? (
          <img
            src={`${API_BASE}/uploads/${user.profileImage}`}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
            👤
          </div>
        )}
        <Button
          onClick={handleLogout}
          className="bg-gray-800 text-white hover:bg-red-600"
        >
          Logout
        </Button>
      </div>

      {/* Sidebar + Main */}
      <div className="max-w-6xl mx-auto mt-20 flex flex-col lg:flex-row gap-8 px-4">
        {/* Sidebar */}
        <aside className="w-full lg:w-60 flex flex-col gap-4 p-4 bg-white bg-opacity-80 rounded shadow-sm">
          <Link
            to="/appointments/upcoming"
            className="text-gray-800 hover:text-blue-600"
          >
            Upcoming Appointments
          </Link>
          <Button
            onClick={() => navigate('/doctors')}
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
          >
            Browse Doctors
          </Button>
          <Link
            to="/appointments/history"
            className="text-gray-800 hover:text-blue-600"
          >
            Appointment History
          </Link>
          <Link to="/profile">
            <Button className="w-full bg-green-500 text-white hover:bg-green-600">
              Profile Settings
            </Button>
          </Link>
          {selectedDoc && (
            <Link
              to={`/chat/${selectedDoc._id}/${user._id}`}
              className="text-gray-800 hover:text-blue-600"
            >
              Chat with Dr. {selectedDoc.name}
            </Link>
          )}
          <Link
            to="/dashboard"
            className="text-gray-800 hover:text-blue-600"
          >
            Go to Dashboard
          </Link>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center px-4">
          <h2 className="self-start text-3xl font-bold text-white mb-6">
            Welcome, {user.name} 👋
          </h2>
          <div className="w-full max-w-md bg-white bg-opacity-90 p-6 rounded shadow-md">
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
                <option value="" disabled>
                  Select a doctor
                </option>
                {doctors.map((d) => (
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
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
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
