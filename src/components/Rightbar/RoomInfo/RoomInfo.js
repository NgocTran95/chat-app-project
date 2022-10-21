import classNames from 'classnames/bind';
import styles from './RoomInfo.module.scss';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, IconButton } from '@mui/material';

const cx = classNames.bind(styles);
function RoomInfo() {
  return (
    <div className={cx('container')}>
      <div className={cx('avatar')}>
        <Avatar
          src="https://theimportantsite.com/wp-content/uploads/2020/04/family-1466262_1280-2.jpg"
          sx={{ width: 60, height: 60 }}
          alt="avatar"
        />
      </div>
      <div className={cx('details')}>
        <div className={cx('name')}>
          <h4>Funny Friends</h4>
          <IconButton className={cx('fix-btn')}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </IconButton>
        </div>
        <p className={cx('member-quantity')}>3 members</p>
        <p className={cx('last-msg-info')}>
          <span>Last message: </span>
          <span>Today, 08:32</span>
        </p>
      </div>
    </div>
  );
}

export default RoomInfo;
