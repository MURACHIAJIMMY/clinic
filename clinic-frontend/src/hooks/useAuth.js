import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContextValue';

const useAuth = () => {
  const contextUser = useContext(AuthContext);
  if (contextUser) return contextUser;

  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return null;
  }
};

export default useAuth;


