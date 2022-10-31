import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '~/firebase/config';
import { CircularProgress } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubcribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({ displayName, email, uid, photoURL });
        setIsLoading(false);
        navigate('/');
        return;
      }
      setUser({});
      setIsLoading(false);
      navigate('/login');
    });
    return () => {
      unsubcribed();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ ...user, setUser }}>
      {isLoading ? <CircularProgress /> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
