

// // src/pages/DoctorsList.jsx
// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import AppLayout from '@/components/ui/AppLayout'
// import Button from '@/components/ui/button'
// import api from '@/lib/axios'

// export default function DoctorsList() {
//   const [doctors, setDoctors] = useState([])
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()

//   useEffect(() => {
//     const loadDoctors = async () => {
//       try {
//         const { data } = await api.get('/doctors')
//         console.log('👩‍⚕️ fetched doctors:', data)
//         setDoctors(data)
//       } catch (err) {
//         console.error('Error fetching doctors:', err)
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadDoctors()
//   }, [])

//   if (loading) {
//     return (
//       <AppLayout>
//         <p className="text-center p-4">Loading doctors…</p>
//       </AppLayout>
//     )
//   }

//   // Base URL for images (remote or local)
//   const IMG_BASE =
//     import.meta.env.VITE_API_URL || 'http://localhost:5000'

//   return (
//     <AppLayout>
//       {/* Back to Booking */}
//       <div className="flex justify-end mb-6">
//         <Button
//           onClick={() => navigate('/book')}
//           className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
//           size="sm"
//         >
//           ↩️↩️ Back to Booking
//         </Button>
//       </div>

//       <h1 className="text-3xl font-bold mb-6 text-center">Our Doctors</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {doctors.map((doc) => {
//           // Destructure according to your API shape
//           const {
//             _id,
//             specialization = 'General',
//             user: {
//               name = 'Unnamed',
//               email = '—',
//               phone = '—',
//               gender = 'Not specified',
//               profileImage,
//             } = {},
//           } = doc

//           // Build image URL dynamically
//           const imgUrl = profileImage
//             ? `${IMG_BASE}/uploads/${profileImage}`
//             : '/placeholder-doctor.png'

//           return (
//             <div
//               key={_id}
//               className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//             >
//               {/* Profile Image */}
//               <div className="h-48 bg-gray-100">
//                 <img
//                   src={imgUrl}
//                   alt={`${name} profile`}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.currentTarget.onerror = null
//                     e.currentTarget.src = '/placeholder-doctor.png'
//                   }}
//                   loading="lazy"
//                 />
//               </div>

//               {/* Details */}
//               <div className="p-4 space-y-1 text-gray-700">
//                 <p>
//                   <strong>Name:</strong> {name}
//                 </p>
//                 <p>
//                   <strong>Gender:</strong> {gender}
//                 </p>
//                 <p>
//                   <strong>Specialization:</strong> {specialization}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {email}
//                 </p>
//                 <p>
//                   <strong>Phone:</strong> {phone}
//                 </p>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     </AppLayout>
//   )
// }

// src/pages/Doctors.jsx
import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { toast } from 'sonner'
import api from '@/lib/axios'
import Button from '@/components/ui/button'

export default function Doctors() {
  const navigate = useNavigate()
  const stored   = localStorage.getItem('user')
  const user     = stored ? JSON.parse(stored) : null

  const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000'

  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/doctors')
      .then(res => setDoctors(res.data))
      .catch(() => toast.error('Failed to load doctors'))
      .finally(() => setLoading(false))
  }, [])

  if (!user) return <Navigate to="/login" replace />

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading doctors…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      {/* Back to booking */}
      <div className="max-w-6xl mx-auto mb-6">
        <Button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 bg-white shadow px-4 py-2 rounded hover:bg-gray-50"
        >
          <FiArrowLeft size={18} />
          <span>Back to Booking</span>
        </Button>
      </div>

      {/* Page title */}
      <h1 className="text-3xl font-bold text-center mb-8">Our Doctors</h1>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map(doc => {
          const filename = doc.profileImage?.replace(/^\/?uploads\//, '') || ''
          const imgSrc = filename
            ? `${BACKEND_URL}/uploads/${filename}`
            : '/placeholder-doctor.png'

          return (
            <div
              key={doc._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={imgSrc}
                alt={doc.name || 'Doctor'}
                onError={e => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = '/placeholder-doctor.png'
                }}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <p><strong>Name:</strong> {doc.name || 'Unnamed'}</p>
                <p><strong>Specialization:</strong> {doc.specialization || 'Not specified'}</p>
                <p><strong>Email:</strong> {doc.email || '—'}</p>
                <p><strong>Phone:</strong> {doc.phone || '—'}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
