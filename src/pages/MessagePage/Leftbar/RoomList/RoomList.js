import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import { useContext } from 'react';

import ChatRoom from './ChatRoom';
import styles from './RoomList.module.scss';
import { AppContext } from '~/Context/AppProvider';
const cx = classNames.bind(styles);
function RoomList() {
  const { rooms, setIsOpenAddRoom } = useContext(AppContext);
  const handleOpenAddRoom = () => {
    setIsOpenAddRoom(true);
  };
  console.log(rooms);
  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <span>Actives Chats</span>
        <IconButton className={cx('add-btn')} onClick={handleOpenAddRoom}>
          <FontAwesomeIcon icon={faPlus} className={cx('icon')} />
        </IconButton>
      </header>
      <form className={cx('search-field')}>
        <input className={cx('search-input')} placeholder="Search people..." />
        <IconButton className={cx('search-btn')}>
          <FontAwesomeIcon icon={faSearch} className={cx('search-icon')} />
        </IconButton>
      </form>
      <div className={cx('rooms')}>
        {rooms.map((room) => (
          <ChatRoom
            key={room.id}
            {...room}
          />
        ))}
      </div>
    </div>
  );
}

export default RoomList;
