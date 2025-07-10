

// import AppLayout from '@/components/ui/AppLayout';

// export default function Dashboard() {
//   const user = JSON.parse(localStorage.getItem('userInfo'));

//   return (
//     <AppLayout>
//       <div className="text-center space-y-4">
//         {user?.role === 'doctor' ? (
//           <>
//             <h1 className="text-3xl font-bold">Welcome, Doctor 🩺</h1>
//             <p className="text-gray-600">
//               Review appointments, manage patient activity, and stay informed.
//             </p>
//           </>
//         ) : (
//           <>
//             <h1 className="text-3xl font-bold">Hello, {user?.name} 👋</h1>
//             <p className="text-gray-600">
//               You're logged in and ready to schedule or view your appointments.
//             </p>
//           </>
//         )}
//       </div>
//     </AppLayout>
//   );
// }

import AppLayout from '@/components/ui/AppLayout';
import useAuth from '@/hooks/useAuth';

export default function Dashboard() {
  const user = useAuth();

  return (
    <AppLayout>
      <div className="text-center space-y-4">
        {user?.role === 'doctor' ? (
          <>
            <h1 className="text-6xl font-bold">Welcome, Doctor 🩺</h1>
            <p className="text-2xl-gray-600">
              Review appointments, manage patient activity, and stay informed.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Hello, {user?.name} 👋</h1>
            <p className="text-gray-600">
              You're logged in and ready to schedule or view your appointments? click BookAppointment👈👈.
            </p>
          </>
        )}
      </div>
    </AppLayout>
  );
}
