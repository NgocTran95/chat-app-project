import classNames from 'classnames/bind';
import { auth, db } from '~/firebase/config';
import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { generateKeyWords } from '~/firebase/services'

import styles from './LoginForm.module.scss';
const fbProvider = new FacebookAuthProvider();
const cx = classNames.bind(styles);

function LoginForm() {
  const handleLoginFacebook = async() => {
    const { _tokenResponse, user, providerId } = await signInWithPopup(auth, fbProvider);
    if (_tokenResponse?.isNewUser) {
      addDoc(collection(db, 'users'), {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        providerId: providerId,
        keywords: generateKeyWords(user.displayName?.toLowerCase()),
        createAt: serverTimestamp()
      })
    }
  };

  return (
    <div className={cx('login-form')}>
      <h3 className={cx('title')}>Login to Open Messenger</h3>
      <button className={cx('login-btn', 'facebook')} onClick={handleLoginFacebook}>
        Login with Facebook
      </button>
      <button className={cx('login-btn', 'google')}>Login with Google</button>
    </div>
  );
}

export default LoginForm;
