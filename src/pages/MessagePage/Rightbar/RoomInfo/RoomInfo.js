import classNames from 'classnames/bind';
import styles from './RoomInfo.module.scss';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, IconButton } from '@mui/material';

import { useContext } from 'react';
import { AppContext } from '~/Context/AppProvider';
import { formatDate } from '~/utilities';

const cx = classNames.bind(styles);
function RoomInfo() {
  const { selectedRoom, selectedRoomId, messages } = useContext(AppContext);
  if (selectedRoomId === '') return;
  const { name, members } = selectedRoom;
  const lastMessage = messages[messages.length - 1]
  return (
    <div className={cx('container')}>
      <div className={cx('avatar')}>
        <Avatar
          src="https://d1nslcd7m2225b.cloudfront.net/Pictures/1024x536/2/4/4/1230244_Minions+3.jpg"
          sx={{ width: 50, height: 50 }}
          alt="avatar"
        />
      </div>
      <div className={cx('details')}>
        <div className={cx('name')}>
          <h4>{name}</h4>
          <IconButton className={cx('fix-btn')}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </IconButton>
        </div>
        <p className={cx('member-quantity')}>{members.length} members</p>
        <p className={cx('last-msg-info')}>
          <span>Last message: </span>
          <span>{formatDate(lastMessage.createAt?.seconds)}</span>
        </p>
      </div>
    </div>
  );
}

export default RoomInfo;
