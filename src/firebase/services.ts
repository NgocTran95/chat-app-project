import {
  AdditionalUserInfo,
  FacebookAuthProvider,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { db, auth } from './config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export const generateKeyWords = (displayName: string) => {
  let keywords: string[] = [];
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

export const addUsers = async (provider: FacebookAuthProvider | GoogleAuthProvider) => {
  const userCredential = await signInWithPopup(auth, provider);
  const additionalUserInfo: AdditionalUserInfo | null = getAdditionalUserInfo(userCredential);
  const { user, providerId } = userCredential;
  if (additionalUserInfo?.isNewUser) {
    addDoc(collection(db, 'users'), {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
      providerId: providerId,
      keywords: generateKeyWords(user.displayName?.toLowerCase() || ''),
      createAt: serverTimestamp(),
    });
  }
};
