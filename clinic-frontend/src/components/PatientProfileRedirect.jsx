
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

export default function PatientProfileRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.role === 'patient') {
      const isIncomplete = [
        user.name,
        user.age,
        user.gender,
        user.phone,
        user.profileImage,
      ].some((field) => !field);

      const protectedRoutes = ['/book']; // Add more if needed

      if (isIncomplete && protectedRoutes.includes(location.pathname)) {
        navigate('/PatientProfile', { replace: true });
      }
    }
  }, [user, location.pathname, navigate]);

  return null;
}
