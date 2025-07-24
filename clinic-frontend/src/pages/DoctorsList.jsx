
// // src/pages/DoctorList.jsx
// import { useState, useEffect } from 'react'
// import { Navigate, useNavigate } from 'react-router-dom'
// import { FiArrowLeft } from 'react-icons/fi'
// import { toast } from 'sonner'
// import api from '@/lib/axios'
// import Button from '@/components/ui/button'
// import placeholder from '@/assets/placeholder-doctor.png'

// export default function DoctorList() {
//   const navigate = useNavigate()
//   const stored   = localStorage.getItem('user')
//   const user     = stored ? JSON.parse(stored) : null

//   // Determine backend URL
//   const BACKEND_URL =
//     import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000'

//   const [doctors, setDoctors] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     api.get('/doctors')
//       .then(res => setDoctors(res.data))
//       .catch(() => toast.error('Failed to load doctors'))
//       .finally(() => setLoading(false))
//   }, [])

//   // Redirect to login if unauthenticated
//   if (!user) {
//     return <Navigate to="/login" replace />
//   }

//   // Show a loading state while fetching
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading doctors…
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 px-4 py-10">
//       {/* Back button */}
//       <div className="max-w-6xl mx-auto mb-6">
//         <Button
//           onClick={() => navigate(-1)}
//           className="inline-flex items-center space-x-2 bg-white shadow px-4 py-2 rounded hover:bg-gray-50"
//         >
//           <FiArrowLeft size={18} />
//           <span>Back to Booking</span>
//         </Button>
//       </div>

//       {/* Page title */}
//       <h1 className="text-3xl font-bold text-center mb-8">
//         Our Doctors
//       </h1>

//       {/* Doctors grid */}
//       <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//         {doctors.map((doc) => {
//           // Normalize the filename by stripping any leading "uploads/" 
//           const filename = doc.profileImage?.replace(/^\/?uploads\//, '') || ''
//           const imgSrc = filename
//             ? `${BACKEND_URL}/uploads/${filename}`
//             : placeholder

//           return (
//             <div
//               key={doc._id}
//               className="bg-white rounded-lg shadow-md overflow-hidden"
//             >
//               <img
//                 src={imgSrc}
//                 alt={doc.name || 'Doctor'}
//                 onError={(e) => {
//                   e.currentTarget.onerror = null
//                   e.currentTarget.src = placeholder
//                 }}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4 space-y-2">
//                 <p>
//                   <strong>Name:</strong> {doc.name || 'Unnamed'}
//                 </p>
//                 <p>
//                   <strong>Specialization:</strong> {doc.specialization || 'Not specified'}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {doc.email || '—'}
//                 </p>
//                 <p>
//                   <strong>Phone:</strong> {doc.phone || '—'}
//                 </p>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// src/pages/DoctorList.jsx
import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { toast } from 'sonner'
import api from '@/lib/axios'
import Button from '@/components/ui/button'
import placeholder from '@/assets/placeholder-doctor.png'

export default function DoctorList() {
  const navigate = useNavigate()
  const stored   = localStorage.getItem('user')
  const user     = stored ? JSON.parse(stored) : null

  // Backend base URL from env or fallback
  const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000'

  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/doctors')
      .then(res => setDoctors(res.data))
      .catch(() => toast.error('Failed to load doctors'))
      .finally(() => setLoading(false))
  }, [])

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Show spinner/text while loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading doctors…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      {/* Back to Booking button */}
      <div className="max-w-6xl mx-auto mb-6">
        <Button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 bg-blue shadow px-4 py-2 rounded hover:bg-gray-50"
        >
          <FiArrowLeft size={18} />
          <span>Back to Booking</span>
        </Button>
      </div>

      {/* Page title */}
      <h1 className="text-3xl font-bold text-center mb-8">Our Doctors</h1>

      {/* Doctors grid */}
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doc) => {
          // Strip any leading uploads/ from the stored filename
          const filename = doc.profileImage?.replace(/^\/?uploads\//, '') || ''
          const imgSrc = filename
            ? `${BACKEND_URL}/uploads/${filename}`
            : placeholder

          return (
            <div
              key={doc._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={imgSrc}
                alt={doc.name || 'Doctor'}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = placeholder
                }}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <p>
                  <strong>Name:</strong> {doc.name || 'Unnamed'}
                </p>
                <p>
                  <strong>Specialization:</strong>{' '}
                  {doc.specialization || 'Not specified'}
                </p>
                <p>
                  <strong>Email:</strong> {doc.email || '—'}
                </p>
                <p>
                  <strong>Phone:</strong> {doc.phone || '—'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
