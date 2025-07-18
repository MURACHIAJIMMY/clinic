

// // import AppLayout from '@/components/ui/AppLayout';
// // import useAuth from '@/hooks/useAuth';

// // export default function Dashboard() {
// //   const user = useAuth();

// //   return (
// //     <AppLayout>
// //       <div className="text-center space-y-4">
// //         {user?.role === 'doctor' ? (
// //           <>
// //             <h1 className="text-6xl font-bold">Welcome Dr.{user?.name} 🩺</h1>
// //             <p className="text-2xl-gray-600">
// //               Review appointments, manage patient activity, and stay informed.
// //             </p>
// //           </>
// //         ) : (
// //           <>
// //             <h1 className="text-4xl font-bold">Hello,👋👋 {user?.name} </h1>
// //             <p className="text-gray-600">
// //               You're now logged in and ready to schedule or view your appointments 📅📅 
// //             </p>
// //             <p className="text-gray-800 font-semibold">
// //               click BookAppointment👈👈.
// //               </p>
// //           </>
// //         )}
// //       </div>
// //     </AppLayout>
// //   );
// // }



// import AppLayout from '@/components/ui/AppLayout';
// import useAuth from '@/hooks/useAuth';
// import { Link } from 'react-router-dom';
// import { Button } from '@/components/ui/button';

// export default function Dashboard() {
//   const user = useAuth();

//   // 🔧 Replace with real target user IDs from context, API, or props
//   const dummyPatientId = '64abc123patientid456';
//   const dummyDoctorId = '65def456doctorid789';

//   return (
//     <AppLayout>
//       <div className="text-center space-y-4">
//         {user?.role === 'doctor' ? (
//           <>
//             <h1 className="text-6xl font-bold">Welcome Dr.{user?.name} 🩺</h1>
//             <p className="text-2xl text-gray-600">
//               Review appointments, manage patient activity, and stay informed.
//             </p>

//             <Button
//               as={Link}
//               to={`/chat/${user._id}/${dummyPatientId}`}
//               className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
//             >
//               💬 Chat with Patient
//             </Button>
//           </>
//         ) : (
//           <>
//             <h1 className="text-4xl font-bold">Hello, 👋 {user?.name}</h1>
//             <p className="text-gray-600">
//               You're now logged in and ready to schedule or view your appointments 📅
//             </p>
//             <p className="text-gray-800 font-semibold">
//               Click BookAppointment 👈
//             </p>

//             <Button
//               as={Link}
//               to={`/chat/${dummyDoctorId}/${user._id}`}
//               className="mt-4 bg-green-600 text-white hover:bg-green-700"
//             >
//               💬 Message Your Doctor
//             </Button>
//           </>
//         )}
//       </div>
//     </AppLayout>
//   );
// }


import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/ui/AppLayout';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const user = useAuth();
  const [targetUserId, setTargetUserId] = useState(null);

  useEffect(() => {
    async function fetchTarget() {
      try {
        if (user?.role === 'doctor') {
          // ✅ First get the doctor's document to retrieve correct _id
          const docRes = await api.get('/doctors/me');
          const doctorId = docRes.data._id;

          const patientRes = await api.get(`/patients/doctor/${doctorId}`);
          setTargetUserId(patientRes.data[0]?._id); // first assigned patient
        } else {
          const res = await api.get(`/doctors/patient/${user._id}`);
          setTargetUserId(res.data?._id); // assigned doctor
        }
      } catch (err) {
        console.error('❌ Failed to fetch chat target:', err.message);
      }
    }

    if (user?._id) fetchTarget();
  }, [user?._id, user?.role]);

  return (
    <AppLayout>
      <div className="text-center space-y-4">
        {user?.role === 'doctor' ? (
          <>
            <h1 className="text-6xl font-bold">Welcome Dr.{user.name} 🩺</h1>
            <p className="text-2xl text-gray-600">
              Review appointments, manage patient activity, and stay informed.
            </p>

            {targetUserId ? (
              <Button
                as={Link}
                to={`/chat/${user._id}/${targetUserId}`}
                className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
              >
                💬 Chat with Patient
              </Button>
            ) : (
              <p className="text-sm text-gray-500">Loading patient info...</p>
            )}
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold">Hello, 👋 {user.name}</h1>
            <p className="text-gray-600">
              You're now logged in and ready to schedule or view your appointments 📅
            </p>
            <p className="text-gray-800 font-semibold">
              Click BookAppointment 👈
            </p>

            {targetUserId ? (
              <Button
                as={Link}
                to={`/chat/${targetUserId}/${user._id}`}
                className="mt-4 bg-green-600 text-white hover:bg-green-700"
              >
                💬 Message Your Doctor
              </Button>
            ) : (
              <p className="text-sm text-gray-500">Looking up your doctor...</p>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}


