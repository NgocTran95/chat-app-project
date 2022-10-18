import classNames from 'classnames/bind';
import styles from './LoginForm.module.scss';
import { auth } from '~/firebase/config';
import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';

const fbProvider = new FacebookAuthProvider();
const cx = classNames.bind(styles);

function LoginForm() {
  const handleLoginFacebook = () => {
    signInWithPopup(auth, fbProvider);
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
