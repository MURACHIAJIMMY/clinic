import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments/me');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const history = res.data.filter((appt) => new Date(appt.date) < today);
        setAppointments(history);
      } catch (err) {
        console.error('Error loading history:', err.message);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Appointment History</h1>

      {appointments.length === 0 ? (
        <p className="text-gray-700">No past appointments.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt._id} className="bg-white p-4 rounded shadow">
              <p className="font-medium">{appt.reason}</p>
              <p>Dr. {appt.doctorName}</p>
              <p>
                {new Date(appt.date).toLocaleDateString()} at {appt.time}
              </p>
              <span className={`text-sm font-semibold ${
                appt.status === 'Confirmed'
                  ? 'text-green-600'
                  : appt.status === 'Cancelled'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}>
                Status: {appt.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
