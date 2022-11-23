import { db } from '../firebase/config';
import { useEffect, useState } from 'react';
import { collection, DocumentData, onSnapshot, orderBy, Query, query, where, WhereFilterOp } from 'firebase/firestore';
export type condition = {
  fieldName: string;
  operator: WhereFilterOp;
  compareValue: string | string[];
};

export type messageType = {
  id: string;
  type: string;
  groupId: string;
  displayName: string;
  photoURL: string;
  text: string;
  createAt: { seconds: number };
  hearts: string[];
  comment?: string;
  uid?: string;
  beforeRevoke?: string;
  image?: fileType;
  video?: fileType;
  application?: fileType;
  quote?: shareMsgType;
};

export type fileType = {
  type: string;
  size: number;
  name: string;
  downloadURL: string;
};

export type shareMsgType = {
  id: string;
  displayName: string;
  type: string;
  name: string;
  size: number;
  downloadURL: string;
};

export const useFireStoreGetMessages = (condition: condition) => {
  const [messages, setMessages] = useState<messageType[]>([]);
  useEffect(() => {
    if (!condition.compareValue.length) {
      return;
    }
    const collectionRef: Query<DocumentData> = query(
      collection(db, 'messages'),
      where(condition.fieldName, condition.operator, condition.compareValue),
      orderBy('createAt', 'asc'),
    );
    const unsubcribe = onSnapshot(collectionRef, (snapshot) => {
      const documents: messageType[] = snapshot.docs.map((doc) => ({
        type: doc.data().type,
        groupId: doc.data().groupId,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
        text: doc.data().text,
        hearts: doc.data().hearts,
        uid: doc.data().uid,
        beforeRevoke: doc.data().beforeRevoke,
        image: doc.data().image,
        video: doc.data().video,
        application: doc.data().application,
        quote: doc.data().quote,
        createAt: doc.data().createAt,
        comment: doc.data().comment,
        id: doc.id,
      }));
      setMessages(documents);
    });
    return () => {
      unsubcribe();
    };
  }, [condition]);
  return messages;
};
