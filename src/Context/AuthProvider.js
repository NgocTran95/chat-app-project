import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '~/firebase/config';
import { CircularProgress } from '@mui/material';

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubcribed = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({ displayName, email, uid, photoURL });
        setIsLoading(false);
        navigate('/');
        return;
      }
      setIsLoading(false);
      navigate('/login');
    });
    return () => {
      unsubcribed();
    };
  }, [navigate]);
 
  return <AuthContext.Provider value={{ ...user }}>{isLoading ? <CircularProgress /> : children}</AuthContext.Provider>;
}

export default AuthProvider;
