

// import { useState, useEffect } from 'react'
// import { toast } from 'sonner'
// import { useNavigate, Link } from 'react-router-dom'
// import api from '@/lib/axios'
// import Button from '@/components/ui/button'
// import { FiBell } from 'react-icons/fi'

// export default function BookAppointment() {
//   const navigate = useNavigate()
//   const user = JSON.parse(localStorage.getItem('user'))

//   const [form, setForm] = useState({
//     patientName: user?.name || '',
//     doctorName: '',
//     date: '',
//     time: '',
//     reason: '',
//   })
//   const [appointments, setAppointments] = useState([])
//   const [doctors, setDoctors] = useState([])

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     toast.success('Logged out successfully')
//     navigate('/login')
//   }

//   const fetchAppointments = async () => {
//     try {
//       const res = await api.get('/appointments/me')
//       setAppointments(res.data)
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Could not fetch appointments')
//     }
//   }

//   const fetchDoctors = async () => {
//     try {
//       const res = await api.get('/doctors')
//       setDoctors(res.data)
//     } catch (err) {
//       console.error('Error loading doctors:', err.message)
//       toast.error('Failed to load doctors')
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       await api.post('/appointments', form)
//       toast.success('Appointment booked!')
//       setForm({
//         patientName: user?.name || '',
//         doctorName: '',
//         date: '',
//         time: '',
//         reason: '',
//       })
//       fetchAppointments()
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Booking failed')
//     }
//   }

//   useEffect(() => {
//     fetchAppointments()
//     fetchDoctors()
//   }, [])

//   const today = new Date()
//   today.setHours(0, 0, 0, 0)

//   const upcomingAppointments = appointments.filter(
//     (a) => new Date(a.date) >= today
//   )
//   const hasSoonAppointment = upcomingAppointments.some((a) => {
//     const daysLeft = (new Date(a.date) - today) / (1000 * 60 * 60 * 24)
//     return daysLeft <= 3
//   })

//   const selectedDoctor = doctors.find((doc) => doc._id === form.doctorName)

//   return (
//     <div
//       className="min-h-screen flex bg-cover bg-center bg-no-repeat px-4 py-10 relative"
//       style={{ backgroundImage: "url('/bg-medical.jpg')" }}
//     >
//       {/* Top-right controls */}
//       <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
//         <Link to="/appointments/upcoming" title="View Upcoming Appointments">
//           <FiBell
//             size={34}
//             className={`cursor-pointer ${
//               hasSoonAppointment
//                 ? 'text-red-600 animate-bounce'
//                 : 'text-green-700'
//             }`}
//           />
//         </Link>

//         {user?.profileImage ? (
//           <img
//             src={`http://localhost:5000/uploads/${user.profileImage}`}
//             alt="Profile"
//             className="w-8 h-8 rounded-full object-cover border border-blue-500"
//           />
//         ) : (
//           <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white">
//             👨
//           </div>
//         )}

//         <Button
//           onClick={handleLogout}
//           className="bg-gray-800 text-white hover:bg-red-600 px-3 py-1 rounded"
//         >
//           Logout
//         </Button>
//       </div>

//       {/* Left Sidebar Navigation */}
//       <div className="flex flex-col gap-4 pt-4 pr-6">
//         <Link
//           to="/appointments/upcoming"
//           className="bg-blue-100 text-blue-800 px-4 py-2 rounded font-medium hover:bg-blue-200"
//         >
//           Upcoming Appointments
//         </Link>

//         <Button
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//           onClick={() => navigate('/doctors')}
//         >
//           👩‍⚕️ Browse All Doctors
//         </Button>

//         <Link
//           to="/appointments/history"
//           className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-medium hover:bg-gray-400"
//         >
//           Appointment History
//         </Link>

//         {/* Replace asChild Button with Link-wrapped Button */}
//         <Link to="/profile">
//           <Button className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-4 py-2 rounded font-medium">
//             Profile Settings
//           </Button>
//         </Link>

//         {/* Chat Button for selected doctor */}
//         {form.doctorName && (
//           <Link
//             to={`/chat/${selectedDoctor._id}/${user._id}`}
//             className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//           >
//             💬 Chat with Dr. {selectedDoctor?.name || 'Selected'}
//           </Link>
//         )}

//         <Link
//           to="/dashboard"
//           className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-500"
//         >
//           Go to Dashboard
//         </Link>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col items-center w-full">
//         <div className="mb-10 text-center text-white">
//           <h2 className="text-3xl font-bold">
//             Welcome, {user?.name || 'Patient'} 👋
//           </h2>
//         </div>

//         <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md p-6 rounded shadow-md">
//           <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
//             Book a New Appointment
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Doctor Dropdown */}
//             <div>
//               <label className="block mb-1">Choose Doctor</label>
//               <select
//                 name="doctorName"
//                 value={form.doctorName}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="" disabled>
//                   Select a doctor
//                 </option>
//                 {doctors.map((doc) => (
//                   <option key={doc._id} value={doc._id}>
//                     Dr. {doc.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1">Date</label>
//               <input
//                 type="date"
//                 name="date"
//                 value={form.date}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             <div>
//               <label className="block mb-1">Time</label>
//               <input
//                 type="time"
//                 name="time"
//                 value={form.time}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             <div>
//               <label className="block mb-1">Reason</label>
//               <textarea
//                 name="reason"
//                 value={form.reason}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             <Button
//               type="submit"
//               className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
//             >
//               Submit
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

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
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const [form,       setForm]       = useState({ patientName: user?.name || '', doctorName: '', date: '', time: '', reason: '' })
  const [appointments, setAppointments] = useState([])
  const [doctors,     setDoctors]     = useState([])
  const [loadingDocs, setLoadingDocs] = useState(true)
  const [submitting,  setSubmitting]  = useState(false)

  useEffect(() => {
    api.get('/appointments/me')
      .then(res => setAppointments(res.data))
      .catch(err => toast.error(err.response?.data?.message || 'Could not fetch appointments'))

    api.get('/doctors')
      .then(res => setDoctors(res.data))
      .catch(() => toast.error('Failed to load doctors'))
      .finally(() => setLoadingDocs(false))
  }, [])

  if (!user) return <Navigate to="/login" replace />

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/appointments', form)
      toast.success('Appointment booked!')
      setForm({ patientName: user.name, doctorName: '', date: '', time: '', reason: '' })
      // refresh
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
  const hasSoon = upcoming.some(a => (new Date(a.date) - today)/(1000*60*60*24) <= 3)
  const selectedDoc = doctors.find(d => d._id === form.doctorName)

  return (
    <div className="min-h-screen relative bg-cover bg-center px-4 py-10" style={{ backgroundImage:"url('/bg-medical.jpg')" }}>
      {/* Top controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <Link to="/appointments/upcoming" title="View Upcoming Appointments">
          <FiBell size={34} className={hasSoon ? 'text-red-600 animate-bounce' : 'text-green-700'} />
        </Link>
        {user.profileImage
          ? <img src={`${API_BASE}/uploads/${user.profileImage}`} alt="Profile" className="w-8 h-8 rounded-full" />
          : <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">👨</div>
        }
        <Button onClick={handleLogout} className="bg-gray-800 text-white hover:bg-red-600">Logout</Button>
      </div>

      {/* Sidebar */}
      <aside className="flex flex-col gap-4 pt-4 pr-6">
        <Link to="/appointments/upcoming" className="…">Upcoming Appointments</Link>
        <Button onClick={() => navigate('/doctors')} className="…">Browse Doctors</Button>
        <Link to="/appointments/history" className="…">Appointment History</Link>
        <Link to="/profile"><Button className="…">Profile Settings</Button></Link>
        {selectedDoc && (
          <Link to={`/chat/${selectedDoc._id}/${user._id}`} className="…">
            Chat with Dr. {selectedDoc.name}
          </Link>
        )}
        <Link to="/dashboard" className="…">Go to Dashboard</Link>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center w-full">
        <h2 className="text-3xl font-bold text-white mb-10">Welcome, {user.name} 👋</h2>
        <div className="w-full max-w-md bg-white bg-opacity-90 p-6 rounded shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Book a New Appointment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select name="doctorName" value={form.doctorName} onChange={handleChange} required className="w-full p-2 border rounded" disabled={loadingDocs}>
              <option value="" disabled>Select a doctor</option>
              {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
            </select>
            <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input type="time" name="time" value={form.time} onChange={handleChange} required className="w-full p-2 border rounded" />
            <textarea name="reason" value={form.reason} onChange={handleChange} required className="w-full p-2 border rounded" />
            <Button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white">
              {submitting ? 'Booking…' : 'Submit'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
