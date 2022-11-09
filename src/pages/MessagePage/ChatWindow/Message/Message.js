import { useContext } from 'react';
import { Avatar } from '@mui/material';
import classNames from 'classnames/bind';

import styles from './Message.module.scss';
import { AuthContext } from '~/Context/AuthProvider';
import { formatDate } from '~/utilities';
import heartIcon from '~/assets/images/heart-icon.png';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase/config';

const cx = classNames.bind(styles);
function Message({ message, index, messages }) {
  const { uid } = useContext(AuthContext);
  const addHeartDrop = () => {
    updateDoc(doc(db, 'messages', message.id), {
      hearts: [...message.hearts, uid],
    });
  };
  if (message.type === 'notification') {
    return (
      <div className={cx('notification')}>
        <div className={cx('notification-text')}>{message.text}</div>
      </div>
    );
  }
  const prevUid = messages[index - 1]?.uid;
  const nextUid = messages[index + 1]?.uid;
  const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  return (
    <div className={cx('msg-container', message.uid === uid ? 'user-msg' : '')}>
      {prevUid === message.uid || (
        <Avatar src={message.photoURL} alt={message.displayName} className={cx('msg-avatar')}>
          {message.photoURL ? '' : message.displayName.charAt(0).toUpperCase()}
        </Avatar>
      )}
      <div
        className={cx(
          'msg-text',
          prevUid !== message.uid ? 'first-text' : '',
          nextUid !== message.uid ? 'last-text' : '',
        )}
      >
        {urlRegex.test(message.text) ? (
          <a className={cx('msg-text-content')} href={message.text} target="_blank" rel="noreferrer">
            {message.text}
          </a>
        ) : (
          <p className={cx('msg-text-content')}>{message.text}</p>
        )}
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
