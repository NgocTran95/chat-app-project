import styles from './LoginPage.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const cx = classNames.bind(styles);
function LoginPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  return (
    <div className={cx('container')}>
      {isLogin ? <LoginForm setIsLogin={setIsLogin} /> : <SignUpForm setIsLogin={setIsLogin} />}
    </div>
  );
}

export default LoginPage;
