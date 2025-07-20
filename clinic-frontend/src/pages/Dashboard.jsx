

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/ui/AppLayout';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/axios';
// import { Button } from '@/components/ui/button';
import Button from "@/components/ui/button"; // ⬅️ no curly braces!
export default function Dashboard() {
  const auth = useAuth();
  const user = auth?.user;
  const [targetUserId, setTargetUserId] = useState(null);

  // 🧪 Hydration logs
  console.log("👤 Auth object:", auth);
  console.log("🧠 User ID:", user?._id);
  console.log("🎭 User role:", user?.role);

  useEffect(() => {
    async function fetchTarget() {
      try {
        if (user?.role === 'doctor') {
          const docRes = await api.get('/doctors/me');
          const doctorId = docRes.data._id;

          const patientRes = await api.get(`/doctor/${doctorId}`);
          setTargetUserId(patientRes.data[0]?._id);
        } else {
          const res = await api.get(`/patient/${user._id}`);
          setTargetUserId(res.data?._id);
        }
      } catch (err) {
        console.error('❌ Failed to fetch chat target:', err.message);
      }
    }

    if (user?._id) fetchTarget();
  }, [user?._id, user?.role]);

  if (!user?.role) {
    return (
      <AppLayout>
        <p className="text-center text-gray-500 p-4">Loading dashboard...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="text-center space-y-4">
        {user.role === 'doctor' ? (
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

            <Button
              as={Link}
              to="/appointments"
              className="mt-4 bg-red-600 text-white hover:bg-red-700"
            >
              📋 Manage Appointments
            </Button>
            <Button
              as={Link}
              to="/patients"
              className="mt-4 bg-yellow-500 text-white hover:bg-yellow-700"
            >
              📋 view Patients 
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold">Hello, 👋 {user.name}</h1>
            <p className="text-gray-600">
              You're now logged in and ready to schedule or view your appointments 📅
            </p>
            <p className="text-gray-800 font-semibold">Click below to get started:</p>

            <Button
  as={Link}
  to="/book"
  variant="default"
  size="default"
  className="bg-purple-600 hover:bg-purple-700"
>
  📅 Book an Appointment
</Button>

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
