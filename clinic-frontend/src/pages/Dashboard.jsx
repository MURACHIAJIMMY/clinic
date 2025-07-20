

// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import AppLayout from '@/components/ui/AppLayout'
// import useAuth from '@/hooks/useAuth'
// import api from '@/lib/axios'
// import Button from '@/components/ui/button'

// export default function Dashboard() {
//   const { user } = useAuth()
//   const [targetUserId, setTargetUserId] = useState(null)

//   useEffect(() => {
//     async function fetchTarget() {
//       try {
//         if (user.role === 'doctor') {
//           // 1️⃣ Get this doctor’s own record
//           const { data: doctor } = await api.get('/doctors/me')

//           // 2️⃣ Get patients assigned to this doctor
//           const { data: patients } = await api.get(
//             `/patients/doctor/${doctor._id}`
//           )

//           // Pick the first patient (or adjust as needed)
//           setTargetUserId(patients[0]?._id || null)
//         } else {
//           // Fetch the logged-in patient’s record
//           const { data: patient } = await api.get('/patients/me')

//           // Extract the assigned doctor’s ID
//           setTargetUserId(patient.doctor || null)
//         }
//       } catch (err) {
//         console.error('❌ Failed to fetch chat target:', err)
//       }
//     }

//     if (user?._id) {
//       fetchTarget()
//     }
//   }, [user])

//   // Show a loader until we know the role
//   if (!user?.role) {
//     return (
//       <AppLayout>
//         <p className="text-center text-gray-500 p-4">
//           Loading dashboard…
//         </p>
//       </AppLayout>
//     )
//   }

//   return (
//     <AppLayout>
//       <div className="text-center space-y-6">
//         {user.role === 'doctor' ? (
//           <>
//             <h1 className="text-6xl font-bold">
//               Welcome Dr. {user.name} 🩺
//             </h1>
//             <p className="text-2xl text-gray-600">
//               Review appointments, manage patient activity, and stay informed.
//             </p>

//             {targetUserId ? (
//               <Button
//                 as={Link}
//                 to={`/chat/${user._id}/${targetUserId}`}
//                 className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 💬 Chat with Patient
//               </Button>
//             ) : (
//               <p className="text-sm text-gray-500">
//                 Loading patient info…
//               </p>
//             )}

//             <Button
//               as={Link}
//               to="/appointments"
//               className="mt-4 bg-red-600 text-white hover:bg-red-700"
//             >
//               📋 Manage Appointments
//             </Button>
//             <Button
//               as={Link}
//               to="/patients"
//               className="mt-4 bg-yellow-500 text-white hover:bg-yellow-700"
//             >
//               📋 View Patients
//             </Button>
//           </>
//         ) : (
//           <>
//             <h1 className="text-4xl font-bold">
//               Hello, 👋 {user.name}
//             </h1>
//             <p className="text-gray-600">
//               You’re now logged in and ready to schedule or view your
//               appointments 📅
//             </p>
//             <Button
//               as={Link}
//               to="/book"
//               variant="default"
//               size="default"
//               className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
//             >
//               📅 Book an Appointment
//             </Button>

//             {targetUserId ? (
//               <Button
//                 as={Link}
//                 to={`/chat/${targetUserId}/${user._id}`}
//                 className="mt-4 bg-green-600 text-white hover:bg-green-700"
//               >
//                 💬 Message Your Doctor
//               </Button>
//             ) : (
//               <p className="text-sm text-gray-500">
//                 Looking up your doctor…
//               </p>
//             )}
//           </>
//         )}
//       </div>
//     </AppLayout>
//   )
// }

// src/pages/Dashboard.jsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '@/components/ui/AppLayout'
import useAuth from '@/hooks/useAuth'
import api from '@/lib/axios'
import Button from '@/components/ui/button'

export default function Dashboard() {
  const { user } = useAuth()
  const [targetUserId, setTargetUserId] = useState(null)

  useEffect(() => {
    async function fetchTarget() {
      try {
        if (user.role === 'doctor') {
          // 1️⃣ Get this doctor's own record
          const { data: doctor } = await api.get('/doctors/me')
          // 2️⃣ Get patients assigned to this doctor
          const { data: patients } = await api.get(
            `/patients/doctor/${doctor._id}`
          )
          setTargetUserId(patients[0]?._id || null)
        } else {
          // Fetch the logged-in patient's record
          const { data: patient } = await api.get('/patients/me')
          // Extract the assigned doctor's ID
          setTargetUserId(patient.doctor || null)
        }
      } catch (err) {
        console.error('❌ Failed to fetch chat target:', err.message)
      }
    }

    if (user?._id) {
      fetchTarget()
    }
  }, [user])

  if (!user?.role) {
    return (
      <AppLayout>
        <p className="text-center text-gray-500 p-4">
          Loading dashboard…
        </p>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="text-center space-y-6">
        {user.role === 'doctor' ? (
          <>
            <h1 className="text-6xl font-bold">
              Welcome Dr. {user.name} 🩺
            </h1>
            <p className="text-2xl text-gray-600">
              Review appointments, manage patient activity, and stay informed.
            </p>

            {targetUserId ? (
              <Link to={`/chat/${user._id}/${targetUserId}`}>
                <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                  💬 Chat with Patient
                </Button>
              </Link>
            ) : (
              <p className="text-sm text-gray-500">
                Loading patient info…
              </p>
            )}

            <Link to="/appointments">
              <Button className="mt-4 bg-red-600 text-white hover:bg-red-700">
                📋 Manage Appointments
              </Button>
            </Link>

            <Link to="/patients">
              <Button className="mt-4 bg-yellow-500 text-white hover:bg-yellow-700">
                📋 View Patients
              </Button>
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold">
              Hello, 👋 {user.name}
            </h1>
            <p className="text-gray-600">
              You’re now logged in and ready to schedule or view your appointments 📅
            </p>

            <Link to="/book">
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                📅 Book an Appointment
              </Button>
            </Link>

            {targetUserId ? (
              <Link to={`/chat/${targetUserId}/${user._id}`}>
                <Button className="mt-4 bg-green-600 text-white hover:bg-green-700">
                  💬 Message Your Doctor
                </Button>
              </Link>
            ) : (
              <p className="text-sm text-gray-500">
                Looking up your doctor…
              </p>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
