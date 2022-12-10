import { db } from '../firebase/config';
import { useEffect, useState } from 'react';
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  Query,
  query,
  where,
  WhereFilterOp,
} from 'firebase/firestore';

export type condition = {
  fieldName: string;
  operator: WhereFilterOp;
  compareValue: string | string[];
};

export type userType = {
  createAt: { seconds: number };
  displayName: string;
  email: string;
  keywords: string[];
  photoURL: string;
  providerId: string;
  status: { last_changed: { seconds: number }; state: string };
  uid: string;
  id: string;
};

export const useFireStoreGetUsers = (condition: condition) => {
  const [users, setUsers] = useState<userType[]>([]);
  useEffect(() => {
    if (!condition.compareValue.length) {
      return;
    }
    const collectionRef: Query<DocumentData> = query(
      collection(db, 'users'),
      where(condition.fieldName, condition.operator, condition.compareValue),
      orderBy('createAt', 'asc'),
    );
    const unsubcribe = onSnapshot(collectionRef, (snapshot) => {
      const documents: userType[] = snapshot.docs.map((doc) => ({
        createAt: doc.data().createAt,
        displayName: doc.data().displayName,
        email: doc.data().email,
        keywords: doc.data().keywords,
        photoURL: doc.data().photoURL,
        providerId: doc.data().providerId,
        status: doc.data().status,
        uid: doc.data().uid,
        id: doc.id,
      }));
      setUsers(documents);
    });
    return () => {
      unsubcribe();
    };
  }, [condition]);
  return users;
};
