import classNames from 'classnames/bind';
import styles from './RoomInfo.module.scss';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, IconButton } from '@mui/material';

import { members } from '~/MockData/data';

const cx = classNames.bind(styles);
function RoomInfo({ isOpen }) {
  return (
    <div className={cx('container', isOpen ? '' : 'close')}>
      <div className={cx('avatar', isOpen ? '' : 'small')}>
        <Avatar
          src="https://theimportantsite.com/wp-content/uploads/2020/04/family-1466262_1280-2.jpg"
          sx={isOpen ? { width: 60, height: 60 } : { width: 40, height: 40 }}
          alt="avatar"
        />
      </div>
      {isOpen && (
        <div className={cx('details')}>
          <div className={cx('name')}>
            <h4>Funny Friends</h4>
            <IconButton className={cx('fix-btn')}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </IconButton>
          </div>
          <p className={cx('member-quantity')}>{members.length} members</p>
          <p className={cx('last-msg-info')}>
            <span>Last message: </span>
            <span>Today, 08:32</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default RoomInfo;
