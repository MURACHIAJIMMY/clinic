// import { useEffect, useState } from 'react';
// import AppLayout from '@/components/ui/AppLayout';
// import useAuth from '@/hooks/useAuth';
// import { toast } from 'sonner';
// import api from '@/lib/axios';

// export default function PatientProfile() {
//   const user = useAuth();
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     gender: '',
//     age: '',
//   });

//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewURL, setPreviewURL] = useState('');
//   const [currentImage, setCurrentImage] = useState('');

//   // Fetch current patient profile
//   useEffect(() => {
//     if (user?.role === 'patient') {
//       api
//         .get('/patients/me')
//         .then((res) => {
//           setFormData({
//             name: res.data.name || '',
//             phone: res.data.phone || '',
//             gender: res.data.gender || '',
//             age: res.data.age || '',
//           });
//           setCurrentImage(res.data.profileImage || '');
//         })
//         .catch(() => toast.error('Failed to load profile'));
//     }
//   }, [user?.role]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPreviewURL(reader.result);
//       reader.readAsDataURL(file);
//     } else {
//       setPreviewURL('');
//     }
//   };

//   const handleUploadImage = async () => {
//     if (!selectedFile) return;

//     const formData = new FormData();
//     formData.append('image', selectedFile);

//     try {
//       const res = await api.put('/patients/profile-image', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       toast.success('Profile image updated!');
//       setCurrentImage(res.data.profileImage || '');
//       const updatedUser = { ...user, profileImage: res.data.profileImage };
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       setSelectedFile(null);
//       setPreviewURL('');
//     } catch {
//       toast.error('Failed to upload image');
//     }
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       await api.patch('/patients/update', formData);
//       toast.success('Profile updated!');
//       const updatedUser = { ...user, ...formData };
//      localStorage.setItem("user", JSON.stringify(updatedUser));
// // Optional: setUser(updatedUser); // if available
//       navigate('/book', { replace: true }); // ✅ Force redirect to appointment page
//     } catch {
//       toast.error('Failed to update profile');
//     }
//   };

//   if (!user || user.role !== 'patient') {
//     return (
//       <AppLayout>
//         <p className="text-red-500">Unauthorized access or invalid user.</p>
//       </AppLayout>
//     );
//   }

//   return (
//     <AppLayout>
//       <div className="max-w-md mx-auto space-y-6">
//         <h2 className="text-2xl font-semibold text-center">Patient Profile</h2>

//         {/* Profile Image Display */}
//         <div className="flex flex-col items-center space-y-2">
//           {currentImage ? (
//             <img
//               src={`http://localhost:5000/${currentImage}`}
//               alt="Profile"
//               className="w-32 h-32 rounded-full object-cover border-2 border-blue-500 shadow"
//             />
//           ) : (
//             <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
//               No Image
//             </div>
//           )}
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="text-sm"
//           />

//           {selectedFile && (
//             <>
//               <p className="text-blue-600 underline font-medium text-sm">
//                 {selectedFile.name}
//               </p>

//               {previewURL && (
//                 <img
//                   src={previewURL}
//                   alt="Preview"
//                   className="w-32 h-32 rounded-full object-cover border mt-2"
//                 />
//               )}

//               <button
//                 onClick={handleUploadImage}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
//               >
//                 Upload Image
//               </button>
//             </>
//           )}
//         </div>

//         {/* Form Fields */}
//         <div className="space-y-3">
//           <label className="block text-sm">
//             Name:
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="w-full mt-1 border rounded px-3 py-2"
//             />
//           </label>

//           <label className="block text-sm">
//             Phone:
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               className="w-full mt-1 border rounded px-3 py-2"
//             />
//           </label>

//           <label className="block text-sm">
//             Gender:
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleInputChange}
//               className="w-full mt-1 border rounded px-3 py-2"
//             >
//               <option value="">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//             </select>
//           </label>

//           <label className="block text-sm">
//             Age:
//             <input
//               type="number"
//               name="age"
//               value={formData.age}
//               onChange={handleInputChange}
//               className="w-full mt-1 border rounded px-3 py-2"
//             />
//           </label>
//         </div>

//         <button
//           onClick={handleUpdateProfile}
//           className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-4"
//         >
//           Save Changes
//         </button>
//       </div>
//     </AppLayout>
//   );
// }



import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/ui/AppLayout';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import api from '@/lib/axios';

export default function PatientProfile() {
  const navigate = useNavigate();
  const user = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    age: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [currentImage, setCurrentImage] = useState('');

  // Fetch current patient profile
  useEffect(() => {
    if (user?.role === 'patient') {
      api
        .get('/patients/me')
        .then((res) => {
          setFormData({
            name: res.data.name || '',
            phone: res.data.phone || '',
            gender: res.data.gender || '',
            age: res.data.age || '',
          });
          setCurrentImage(res.data.profileImage || '');
        })
        .catch(() => toast.error('Failed to load profile'));
    }
  }, [user?.role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', selectedFile);

    try {
      const res = await api.put('/patients/profile-image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Profile image updated!');
      setCurrentImage(res.data.profileImage || '');

      // Sync new image with localStorage
      const updatedUser = { ...user, profileImage: res.data.profileImage };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSelectedFile(null);
      setPreviewURL('');
    } catch {
      toast.error('Failed to upload image');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.patch('/patients/update', formData);
      toast.success('Profile updated!');

      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      navigate('/book', { replace: true }); // Redirect cleanly to booking page
    } catch {
      toast.error('Failed to update profile');
    }
  };

  if (!user || user.role !== 'patient') {
    return (
      <AppLayout>
        <p className="text-red-500">Unauthorized access or invalid user.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-md mx-auto space-y-6">
        <h2 className="text-2xl font-semibold text-center">Patient Profile</h2>

        {/* Profile Image Display */}
        <div className="flex flex-col items-center space-y-2">
          {currentImage ? (
            <img
              src={`http://localhost:5000/${currentImage}`}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-blue-500 shadow"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm"
          />

          {selectedFile && (
            <>
              <p className="text-blue-600 underline font-medium text-sm">
                {selectedFile.name}
              </p>

              {previewURL && (
                <img
                  src={previewURL}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border mt-2"
                />
              )}

              <button
                onClick={handleUploadImage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
              >
                Upload Image
              </button>
            </>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          <label className="block text-sm">
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            Phone:
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            Gender:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <label className="block text-sm">
            Age:
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </label>
        </div>

        <button
          onClick={handleUpdateProfile}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-4"
        >
          Save Changes
        </button>
      </div>
    </AppLayout>
  );
}
