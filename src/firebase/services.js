import { signInWithPopup } from 'firebase/auth';
import { db, auth } from './config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

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

