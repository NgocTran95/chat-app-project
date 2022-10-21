import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import ChatRoom from './ChatRoom';
import styles from './RoomList.module.scss';

const cx = classNames.bind(styles);
function RoomList() {
  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <span>Actives Chats</span>
        <IconButton className={cx('add-btn')}>
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
        <ChatRoom isActive={true} />
        <ChatRoom />
        <ChatRoom />
        <ChatRoom />
        <ChatRoom />
        <ChatRoom />
        <ChatRoom />
        <ChatRoom />
        <ChatRoom />
        <ChatRoom />
        <ChatRoom />
        <ChatRoom />
      </div>
    </div>
  );
}

export default RoomList;
