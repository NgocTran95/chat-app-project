import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '~/firebase/config';
import { CircularProgress } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getUsers = async (uid) => {
    const q = query(collection(db, 'users'), where('uid', '==', uid), orderBy('createAt'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
    }));
  };

  useEffect(() => {
    const unsubcribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({ displayName, email, uid, photoURL });
        // Set user online when login
        getUsers(uid).then((userIds) => {
          updateDoc(doc(db, 'users', userIds[0].id), { status: { state: 'Online', last_changed: serverTimestamp() } });
        });
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
