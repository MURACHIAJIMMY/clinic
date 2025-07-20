import { useEffect, useState } from 'react';
import AppLayout from '@/components/ui/AppLayout';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import api from '@/lib/axios';

export default function Profile() {
  const {user} = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (user?.role) {
      const endpoint = user.role === 'doctor' ? '/doctors/me' : '/patients/me';
      api
        .get(endpoint)
        .then((res) => {
          setCurrentImage(res.data.profileImage || '');
          setProfile(res.data);
        })
        .catch(() => {
          setCurrentImage('');
          setProfile({});
        });
    }
  }, [user?.role]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewURL(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewURL('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    const endpoint =
      user.role === 'doctor'
        ? '/doctors/profile-image'
        : '/patients/profile-image';

    try {
      const res = await api.put(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile image updated!');
      setCurrentImage(res.data.profileImage || '');
      setSelectedFile(null);
      setPreviewURL('');
    } catch (err) {
      toast.error('Failed to upload image');
      console.error('Upload error:', err.message);
    }
  };

  if (!user) {
    return (
      <AppLayout>
        <p className="text-red-500">User not found or token is invalid.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-md mx-auto flex flex-col items-center text-center space-y-6">
        <h2 className="text-2xl font-semibold">Your Profile</h2>

        {currentImage ? (
          <img
            key={currentImage}
            src={`http://localhost:5000/${currentImage}`}
            alt="Profile"
            onError={(e) => {
              console.warn('🛑 Image failed to load:', e.currentTarget.src);
              e.currentTarget.style.display = 'none';
            }}
            className="w-40 h-40 rounded-full object-cover border-2 border-blue-500 shadow-md"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}
<div className="text-gray-700 space-y-1">
  <p><strong>Name:</strong> {profile.name || user.name}</p>
  <p><strong>Email:</strong> {profile.email || user.email}</p>
  <p><strong>Role:</strong> {user.role}</p>

  {/* only show phone here when a patient is logged in */}
  {user.role === 'patient' && profile.phone && (
    <p><strong>Phone:</strong> {profile.phone}</p>
  )}
</div>

{/* doctor‐only section */}
{user.role === 'doctor' && (
  <div className="text-gray-700 space-y-1">
    <p><strong>Specialization:</strong> {profile.specialization || '—'}</p>
    <p><strong>Phone:</strong> {profile.phone || '—'}</p>
  </div>
)}


        <div className="w-full space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-blue-600 underline"
          />

          {selectedFile && (
            <p className="text-blue-500 underline font-medium text-sm">
              {selectedFile.name}
            </p>
          )}

          {previewURL && (
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-1">Preview:</p>
              <img
                src={previewURL}
                alt="Preview"
                className="w-40 h-40 rounded-full object-cover border"
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-2 ${
              !selectedFile ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!selectedFile}
          >
            Upload Image
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
