

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import Button from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments/me')
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const history = res.data.filter(
          (appt) => new Date(appt.date) < today
        )
        setAppointments(history)
      } catch (err) {
        console.error('Error loading history:', err.message)
      }
    }

    fetchAppointments()
  }, [])

  return (
    <div className="relative min-h-screen px-6 py-10 bg-gray-100">
      {/* 📌 Top-right “Go back” button */}
      <div className="absolute top-6 right-6 z-10">
        <Link to="/book">
          <Button className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded">
            📅 Go back
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Appointment History</h1>

      {appointments.length === 0 ? (
        <p className="text-gray-700">No past appointments.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li
              key={appt._id}
              className="bg-white p-4 rounded shadow flex flex-col space-y-1"
            >
              <p className="font-medium">{appt.reason}</p>
              <p className="text-gray-600">Dr. {appt.doctorName}</p>
              <p className="text-gray-600">
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
  )
}
