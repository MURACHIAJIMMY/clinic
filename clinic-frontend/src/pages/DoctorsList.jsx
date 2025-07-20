// import { useEffect, useState } from 'react'
// import AppLayout from '@/components/ui/AppLayout'
// import api from '@/lib/axios'

// export default function DoctorsList() {
//   const [doctors, setDoctors] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     api.get('/doctors')
//       .then(res => setDoctors(res.data))
//       .catch(err => console.error(err))
//       .finally(() => setLoading(false))
//   }, [])

//   if (loading) {
//     return (
//       <AppLayout>
//         <p className="text-center p-4">Loading doctors…</p>
//       </AppLayout>
//     )
//   }

//   return (
//     <AppLayout>
//       <h1 className="text-3xl font-bold mb-8 text-center">Our Doctors</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {doctors.map(doc => (
//           <div
//             key={doc._id}
//             className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
//           >
//             {/* Profile image */}
//             <div className="h-48 bg-gray-100">
//               <img
//                 src={`http://localhost:5000/${doc.profileImage}`}
//                 alt={doc.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             {/* Details section */}
//             <div className="p-4 space-y-2">
//               <h2 className="text-xl font-semibold">{doc.name}</h2>
//               <p className="text-sm text-gray-600">{doc.gender || 'Not specified'}</p>
//               <p className="text-sm text-indigo-600 font-medium">{doc.specialization || 'General'}</p>

//               <div className="mt-2 space-y-1">
//                 <div className="flex items-center text-gray-700 text-sm">
//                   <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M2 2h16v16H2V2zm8 14a6 6 0 110-12 6 6 0 010 12z" />
//                   </svg>
//                   <span>{doc.email}</span>
//                 </div>
//                 <div className="flex items-center text-gray-700 text-sm">
//                   <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M2 2h16v16H2V2zm3 8a5 5 0 0110 0A5 5 0 015 10z" />
//                   </svg>
//                   <span>{doc.phone || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </AppLayout>
//   )
// }

// src/pages/DoctorsList.jsx

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '@/components/ui/AppLayout'
import Button from '@/components/ui/button'
import api from '@/lib/axios'

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get('/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error('Error fetching doctors:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <p className="text-center p-4">Loading doctors…</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Back to Booking */}
      <div className="flex justify-end mb-6">
        <Button
          onClick={() => navigate('/book')}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          variant="default"
          size="sm"
        >
          ← Back to Booking
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Our Doctors</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doc => {
          const {
            _id,
            name,
            gender,
            specialization,
            email,
            phone,
            profileImage,
          } = doc

          return (
            <div
              key={_id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              {/* Profile Image */}
              <img
                src={`http://localhost:5000/${profileImage}`}
                alt={name}
                className="w-full h-40 object-cover rounded"
                onError={e => {
                  e.currentTarget.src = '/placeholder-doctor.png'
                }}
              />

              {/* Doctor Details */}
              <div className="mt-4 space-y-1 text-gray-700">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Gender:</strong> {gender || 'Not specified'}</p>
                <p><strong>Specialization:</strong> {specialization || 'General'}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Phone:</strong> {phone || 'N/A'}</p>
              </div>
            </div>
          )
        })}
      </div>
    </AppLayout>
  )
}
