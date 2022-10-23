import styles from './LoginPage.module.scss'
import classNames from 'classnames/bind';

import LoginForm from '~/pages/LoginPage/LoginForm';

const cx = classNames.bind(styles)
function LoginPage() {
  return (
    <div className={cx('container')}>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
