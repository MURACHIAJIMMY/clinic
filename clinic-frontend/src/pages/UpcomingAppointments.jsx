

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Button from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments/me');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = res.data.filter((appt) => new Date(appt.date) >= today);
        setAppointments(upcoming);
      } catch (err) {
        console.error('Error loading upcoming:', err.message);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="relative min-h-screen px-6 py-10 bg-blue-50">
      {/* 📌 Top-right button */}
      <Button
        as={Link}
        to="/book"
        variant="default"
        size="default"
        className="absolute top-6 right-6 bg-purple-600 hover:bg-purple-700 z-10"
      >
        📅 Go back
      </Button>

      <h1 className="text-2xl font-bold mb-6">Upcoming Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-gray-700">No upcoming appointments.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt._id} className="bg-white p-4 rounded shadow">
              <p className="font-medium">{appt.reason}</p>
              <p>Dr. {appt.doctorName}</p>
              <p>
                {new Date(appt.date).toLocaleDateString()} at {appt.time}
              </p>
              <span
                className={`text-sm font-semibold ${
                  appt.status === 'Confirmed'
                    ? 'text-green-600'
                    : appt.status === 'Cancelled'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                Status: {appt.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
