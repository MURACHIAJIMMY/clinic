import { useEffect, useState } from 'react';
import AppLayout from '@/components/ui/AppLayout';
import api from '@/lib/axios';

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppLayout>
      <p className="text-center p-4">Loading doctors…</p>
    </AppLayout>
  );

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold mb-6">Our Doctors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {doctors.map(doc => (
          <div key={doc._id} className="border p-4 rounded shadow-sm">
            <img
              src={`http://localhost:5000/${doc.profileImage}`}
              alt={doc.name}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{doc.name}</h2>
            <p className="text-gray-600">{doc.specialization}</p>
            <p className="text-gray-600">{doc.phone}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
