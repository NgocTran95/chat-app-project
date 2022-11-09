import { signInWithPopup } from 'firebase/auth';
import { db, auth } from './config';
import { addDoc, collection, serverTimestamp, orderBy, getDocs, where, query } from 'firebase/firestore';

export const generateKeyWords = (displayName) => {
  let keywords = [];
  const subStrArr = displayName.split(' ');
  subStrArr.forEach((subStr) => {
    const length = subStr.length;
    let keyword;
    for (let i = 1; i <= length; i++) {
      keyword = subStr.slice(0, i);
      keywords.push(keyword);
    }
  });
  return keywords;
};

export const addUsers = async (provider) => {
  const { _tokenResponse, user, providerId } = await signInWithPopup(auth, provider);
  if (_tokenResponse?.isNewUser) {
    addDoc(collection(db, 'users'), {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
      providerId: providerId,
      keywords: generateKeyWords(user.displayName?.toLowerCase()),
      createAt: serverTimestamp(),
    });
  }
};

// Function handle add notification when create new one group
const getGroups = async (uid) => {
  const q = query(collection(db, 'groups'), where('members', 'array-contains', uid), orderBy('createAt'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
  }));
};

export const addNotificationWhenCreateGroup = async(uid, message, displayName) => {
  getGroups(uid).then((groupIds) =>
    addDoc(collection(db, 'messages'), {
      type: 'notification',
      text: message,
      displayName,
      groupId: groupIds[groupIds.length - 1].id,
      createAt: serverTimestamp(),
    }),
  );
};
