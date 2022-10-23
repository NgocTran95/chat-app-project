import styles from './Leftbar.module.scss';
import classNames from 'classnames/bind';
import logo from '~/assets/images/logo.png';
import Profile from './Profile';
import RoomList from './RoomList';

const cx = classNames.bind(styles);
function Leftbar() {
  return (
    <div className={cx('leftbar')}>
      <div className={cx('leftbar-inner')}>
        <div className={cx('leftbar-header')}>
          <div className={cx('logo')}>
            <img src={logo} alt="logo" />
          </div>
          <div className={cx('brand')}>
            <span>Open</span>
            <h2>Messenger</h2>
          </div>
        </div>
        <Profile />
        <RoomList />
      </div>
    </div>
  );
}

export default Leftbar;
