import styles from './Profile.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import ProfileAvatar from '~/components/ProfileAvatar';

const cx = classNames.bind(styles);
function Profile() {
  return (
    <article className={cx('container')}>
      <div className={cx('avatar')}>
        <ProfileAvatar
          status="Online"
          image="https://9mobi.vn/cf/images/2015/03/nkk/hinh-anh-dep-1.jpg"
          width={60}
          height={60}
        />
      </div>
      <div className={cx('info')}>
        <h4 className={cx('name')}>Joe Tran</h4>
        <p className={cx('desc')}>Front-end Dev</p>
        <div className={cx('status')}>Online</div>
      </div>
      <IconButton className={cx('logout')}>
        <FontAwesomeIcon icon={faRightFromBracket} className={cx('icon')} />
      </IconButton>
    </article>
  );
}

export default Profile;
