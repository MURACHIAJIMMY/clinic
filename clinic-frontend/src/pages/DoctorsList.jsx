
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
//         console.error('Error fetching doctors:', err.message)
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

//   return (
//     <AppLayout>
//       <div className="flex justify-end mb-6">
//         <Button
//           onClick={() => navigate('/book')}
//           className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
//           size="sm"
//         >
//           ← Back to Booking
//         </Button>
//       </div>

//       <h1 className="text-3xl font-bold mb-6 text-center">Our Doctors</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {doctors.map((doc) => {
//           const userData       = doc.user || {}
//           const name           = userData.name || 'Unnamed'
//           const email          = userData.email || '—'
//           const phone          = userData.phone || '—'
//           const gender         = userData.gender || 'Not specified'
//           const specialization = doc.specialization || 'General'
//           const filename       = userData.profileImage
//           const imgUrl = filename
//             ? `http://localhost:5000/uploads/${filename}`
//             : '/placeholder-doctor.png'

//           return (
//             <div
//               key={doc._id}
//               className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//             >
//               <div className="h-48 bg-gray-100">
//                 <img
//                   src={imgUrl}
//                   alt={name}
//                   className="w-full h-full object-cover"
//                   onError={(e) => (e.currentTarget.src = '/placeholder-doctor.png')}
//                 />
//               </div>

//               <div className="p-4 space-y-1 text-gray-700">
//                 <p><strong>Name:</strong> {name}</p>
//                 <p><strong>Gender:</strong> {gender}</p>
//                 <p><strong>Specialization:</strong> {specialization}</p>
//                 <p><strong>Email:</strong> {email}</p>
//                 <p><strong>Phone:</strong> {phone}</p>
//               </div>
//             </div>
//           )
//         })}
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
    const loadDoctors = async () => {
      try {
        const { data } = await api.get('/doctors')
        console.log('👩‍⚕️ fetched doctors:', data)
        setDoctors(data)
      } catch (err) {
        console.error('Error fetching doctors:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadDoctors()
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
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
          size="sm"
        >
          ← Back to Booking
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Our Doctors</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => {
          const {
            _id,
            name,
            email = '—',
            phone = '—',
            gender = 'Not specified',
            specialization = 'General',
            profileImage,
          } = doc

          const imgUrl = profileImage
            ? `http://localhost:5000/uploads/${profileImage}`
            : '/placeholder-doctor.png'

          return (
            <div
              key={_id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Profile Image */}
              <div className="h-48 bg-gray-100">
                <img
                  src={imgUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src = '/placeholder-doctor.png')
                  }
                />
              </div>

              {/* Details */}
              <div className="p-4 space-y-1 text-gray-700">
                <p>
                  <strong>Name:</strong> {name}
                </p>
                <p>
                  <strong>Gender:</strong> {gender}
                </p>
                <p>
                  <strong>Specialization:</strong> {specialization}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
                <p>
                  <strong>Phone:</strong> {phone}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </AppLayout>
  )
}
