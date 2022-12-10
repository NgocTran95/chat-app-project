import { db } from '../firebase/config';
import { useEffect, useState } from 'react';
import { collection, DocumentData, onSnapshot, orderBy, Query, query, where, WhereFilterOp } from 'firebase/firestore';

export type condition = {
  fieldName: string;
  operator: WhereFilterOp;
  compareValue: string | string[];
};

export type groupType = {
  admins: string[];
  avatarURL: string;
  createAt: { seconds: number };
  description: string;
  members: string[];
  name: string;
  id: string;
};

export const useFireStoreGetGroup = (condition: condition) => {
  const [groups, setGroups] = useState<groupType[]>([]);
  useEffect(() => {
    if (!condition.compareValue.length) {
      return;
    }
    const collectionRef: Query<DocumentData> = query(
      collection(db, 'groups'),
      where(condition.fieldName, condition.operator, condition.compareValue),
      orderBy('createAt', 'asc'),
    );
    const unsubcribe = onSnapshot(collectionRef, (snapshot) => {
      const documents: groupType[] = snapshot.docs.map((doc) => ({
        admins: doc.data().admins,
        avatarURL: doc.data().avatarURL,
        createAt: doc.data().createAt,
        description: doc.data().description,
        members: doc.data().members,
        name: doc.data().name,
        id: doc.id,
      }));
      setGroups(documents);
    });
    return () => {
      unsubcribe();
    };
  }, [condition]);
  return groups;
};
