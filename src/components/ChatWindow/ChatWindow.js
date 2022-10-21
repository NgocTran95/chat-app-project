import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceGrinWide } from '@fortawesome/free-regular-svg-icons'
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { Avatar, AvatarGroup, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './ChatWindow.module.scss';
import BlockMessage from './BlockMessage';
import { messages, members } from '~/MockData/data'

const cx = classNames.bind(styles);
function ChatWindow() {
  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <p className={cx('name')}>Funny Friends</p>
        <AvatarGroup max={4} total={members.length}>
          {
            members.map(member => (
              <Avatar key={member.id} src={member.image} alt={member.name}/>
            ))
          }
        </AvatarGroup>
      </header>
      <div className={cx('inner')}>
        <div className={cx('msg-field')}>
          {
            messages.map(message => (
              <BlockMessage key={message.id} {...message}/>
            ))
          }
        </div>
        <form className={cx('reply-field')}>
          <input className={cx('reply-input')} placeholder='Enter your message here...'/>
          <div className={cx('reply-btns')}>
            <IconButton className={cx('reply-btn')}>
              <FontAwesomeIcon icon={faFaceGrinWide} className={cx('icon')}/>
            </IconButton>
            <IconButton className={cx('reply-btn')}>
              <FontAwesomeIcon icon={faPaperclip} className={cx('icon')}/>
            </IconButton>
            <IconButton className={cx('reply-btn', 'send-btn')}>
              <FontAwesomeIcon icon={faPaperPlane} className={cx('icon')}/>
            </IconButton>
          </div>
        </form>
      </div>

    </div>
  );
}

export default ChatWindow;
