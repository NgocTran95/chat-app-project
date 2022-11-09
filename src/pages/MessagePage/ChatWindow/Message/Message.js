import { useContext } from 'react';
import { Avatar } from '@mui/material';
import classNames from 'classnames/bind';

import styles from './Message.module.scss';
import { AuthContext } from '~/Context/AuthProvider';
import { formatDate } from '~/utilities';
import heartIcon from '~/assets/images/heart-icon.png';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase/config';
import MessageContent from './MessageContent';

const cx = classNames.bind(styles);
function Message({ message, index, messages }) {
  const { uid } = useContext(AuthContext);
  const addHeartDrop = () => {
    updateDoc(doc(db, 'messages', message.id), {
      hearts: [...message.hearts, uid],
    });
  };
  // Notification messages
  if (message.type === 'notification') {
    return (
      <div className={cx('notification')}>
        <div className={cx('notification-text')}>{message.text}</div>
      </div>
    );
  }
  // Default messages
  const prevUid = messages[index - 1]?.uid;
  const nextUid = messages[index + 1]?.uid;
  return (
    <div className={cx('msg-container', message.uid === uid ? 'user-msg' : '')}>
      {prevUid === message.uid || (
        <Avatar src={message.photoURL} alt={message.displayName} className={cx('msg-avatar')}>
          {message.photoURL ? '' : message.displayName.charAt(0).toUpperCase()}
        </Avatar>
      )}
      <div
        className={cx(
          'msg-inner',
          prevUid !== message.uid ? 'first-msg' : '',
          nextUid !== message.uid ? 'last-msg' : '',
        )}
      >
        <MessageContent message={message}/>
        {nextUid === message.uid || <span className={cx('msg-time')}>{formatDate(message.createAt?.seconds)}</span>}
        {message.hearts.length > 0 && (
          <div className={cx('heart-num-container')}>
            <div className={cx('heart-num')}>
              <img src={heartIcon} alt="heart-icon" />
              {message.hearts.length}
            </div>
          </div>
        )}
        <div className={cx('heart-btn')} onClick={addHeartDrop}>
          <img className={cx('heart-icon')} src={heartIcon} alt="heart-icon" />
        </div>
      </div>
    </div>
  );
}

export default Message;
