import classNames from 'classnames/bind';
import styles from './RoomInfo.module.scss';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, IconButton } from '@mui/material';

import { useContext, useState } from 'react';
import { AppContext } from '~/Context/AppProvider';
import { formatDate } from '~/utilities';
import { updateDoc, doc, collection } from 'firebase/firestore';
import { db } from '~/firebase/config';

const cx = classNames.bind(styles);
function RoomInfo() {
  const [isChangingRoomName, setIsChangingRoomName] = useState(false)
  const [newRoomName, setNewRoomName] = useState('');
  const { selectedRoom, selectedRoomId, messages } = useContext(AppContext);
  
  if (selectedRoomId === '') return;
  const { name, members } = selectedRoom;
  const lastMessage = messages[messages.length - 1];

  const handleChangeRoomName = (e) => {
    e.preventDefault();
    if (newRoomName !== '') {
      const roomRef = doc(collection(db, 'rooms'), `${selectedRoomId}`);
      updateDoc(roomRef, { name: newRoomName });
    }
    setIsChangingRoomName(false);
  };
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
          {isChangingRoomName ? (
            <form onSubmit={handleChangeRoomName}>
              <input
                autoFocus
                type="text"
                className={cx('change-name-input')}
                defaultValue={name}
                onChange={(e) => setNewRoomName(e.target.value)}
                value={newRoomName}
              />
            </form>
          ) : (
            <h4>{name}</h4>
          )}
          <IconButton className={cx('fix-btn')} onClick={() => setIsChangingRoomName(true)}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </IconButton>
        </div>
        <p className={cx('member-quantity')}>{members.length} members</p>
        <p className={cx('last-msg-info')}>
          <span>Last message: </span>
          <span>{formatDate(lastMessage?.createAt?.seconds)}</span>
        </p>
      </div>
    </div>
  );
}

export default RoomInfo;
