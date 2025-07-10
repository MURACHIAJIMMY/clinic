
import { useEffect, useState } from 'react';
import AppLayout from '@/components/ui/AppLayout';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/axios';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const user = useAuth();
  
   console.log('Resolved user:', user);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch appointments');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(
        `/appointments/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update appointment');
    }
  };

  const deleteAppointment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Appointment deleted');
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete appointment');
    }
  };

  const editAppointment = (appt) => {
    toast.info(`Open modal or redirect to edit appointment with ID: ${appt._id}`);
    // ⬆️ You can replace this with navigation or modal trigger
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <AppLayout>
      <h2 className="text-2xl font-semibold mb-4">Your Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <ul className="space-y-3">
          {appointments.map((appt) => (
            <li
              key={appt._id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{appt.patientName}</p>
                <p className="text-sm text-gray-600">
                  {new Date(appt.date).toLocaleDateString()} at {appt.time}
                </p>
                <p className="text-sm text-gray-500 italic">{appt.reason}</p>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <span
                  className={`text-sm font-medium px-2 py-1 rounded ${
                    appt.status === 'Confirmed'
                      ? 'bg-green-100 text-green-800'
                      : appt.status === 'Cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {appt.status}
                </span>

                {user?.role === 'doctor' && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {appt.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(appt._id, 'Confirmed')}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(appt._id, 'Cancelled')}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteAppointment(appt._id)}
                      className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {user?.role === 'patient' && appt.createdBy === user._id && (
                  <button
                    onClick={() => editAppointment(appt)}
                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
}
