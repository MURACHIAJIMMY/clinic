

import { useEffect, useState } from 'react';
import AppLayout from '@/components/ui/AppLayout';
import { toast } from 'sonner';
import api from '@/lib/axios';

export default function Patients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/patients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPatients(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch patients');
      }
    };

    fetchPatients();
  }, []);

  return (
    <AppLayout>
      <h2 className="text-2xl font-semibold mb-4">Patients List</h2>

      {patients.length === 0 ? (
        <p className="text-gray-600">No patients found.</p>
      ) : (
        <ul className="space-y-3">
          {patients.map((patient) => (
            <li
              key={patient._id}
              className="bg-white p-4 rounded shadow flex justify-between items-start"
            >
              <div className="space-y-1 text-sm text-gray-700">
                <p className="text-base font-medium text-gray-900">{patient.name}</p>
                <p>Email: {patient.email}</p>
                <p>Phone: {patient.phone || '—'}</p>
                <p>Gender: {patient.gender || '—'}</p>
                <p>Age: {patient.age || '—'}</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded h-fit">
                {patient.status || 'Active'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
}
