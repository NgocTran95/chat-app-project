import styles from './Profile.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@mui/material';

const cx = classNames.bind(styles);
function Profile() {
  return (
    <article className={cx('profile')}>
      <div className={cx('avatar')}>
        <Avatar
          src="https://9mobi.vn/cf/images/2015/03/nkk/hinh-anh-dep-1.jpg"
          alt="avatar"
          sx={{ width: 60, height: 60 }}
        />
        <span className={cx('status-dot')}></span>
      </div>
      <div className={cx('info')}>
        <h4 className={cx('name')}>Joe Tran</h4>
        <p className={cx('desc')}>Front-end Dev</p>
        <div className={cx('status')}>Online</div>
      </div>
      <div className={cx('logout')}>
        <FontAwesomeIcon icon={faRightFromBracket} className={cx('icon')}/>
      </div>
    </article>
  );
}

export default Profile;
