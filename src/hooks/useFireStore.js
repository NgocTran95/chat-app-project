import { db } from '~/firebase/config';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';

export const useFireStore = (collectionName, condition) => {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    // condition
    /* {
        fieldName: 'abc,
        operator: '==',
        compareValue: 'acd'

    } */
    console.log(collectionName, condition);
    let collectionRef;
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        return;
      }
      collectionRef = query(
        collection(db, collectionName),
        where(condition.fieldName, condition.operator, condition.compareValue),
        orderBy('createAt'),
      );
      console.log(collection(db, collectionName));
    }
    const unsubcribe = onSnapshot(collectionRef, (snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocuments(documents);
    });
    return unsubcribe
  }, [collectionName, condition]);
  return documents; 
};
