import React, { createContext, SetStateAction, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import Loading from '../components/Loading';

type Props = {
  children: JSX.Element;
};
type User = {
  displayName: string | null;
  email: string | null;
  uid: string;
  photoURL: string | null;
};
const AuthContextDefaultValue: {user: User, setUser: React.Dispatch<SetStateAction<User>>} = {
  user: { displayName: '', email: '', uid: '', photoURL: '' },
  setUser: () => {},
};
export const AuthContext = createContext(AuthContextDefaultValue);

function AuthProvider({ children }: Props) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(AuthContextDefaultValue.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUsers = async (uid: string) => {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
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
      setUser({ displayName: '', email: '', uid: '', photoURL: '' });
      setIsLoading(false);
      navigate('/login');
    });
    return () => {
      unsubcribed();
    };
  }, [navigate]);

  return <AuthContext.Provider value={{ user, setUser }}>{isLoading ? <Loading /> : children}</AuthContext.Provider>;
}

export default AuthProvider;
