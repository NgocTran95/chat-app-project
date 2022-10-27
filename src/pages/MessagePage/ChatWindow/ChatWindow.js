import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceGrinWide } from '@fortawesome/free-regular-svg-icons';
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Avatar, AvatarGroup, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import styles from './ChatWindow.module.scss';

import { AppContext } from '~/Context/AppProvider';
import { AuthContext } from '~/Context/AuthProvider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '~/firebase/config';
import { formatDate } from '~/utilities';

const cx = classNames.bind(styles);
function ChatWindow() {
  const [messageValue, setMessageValue] = useState('');
  const { selectedRoom, selectedRoomId, members, messages } = useContext(AppContext);
  const { uid, photoURL, displayName } = useContext(AuthContext);
  if (selectedRoomId === '')
    return (
      <div className={cx('container')}>
        <p className={cx('notification')}>Select a chat to messaging</p>
      </div>
    );
  const { name, description } = selectedRoom;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageValue.trim().length === 0) return;
    addDoc(collection(db, 'messages'), {
      text: messageValue,
      uid,
      photoURL,
      displayName,
      roomId: selectedRoomId,
      createAt: serverTimestamp(),
    });
    setMessageValue('');
  };
  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <div className={cx('info')}>
          <p className={cx('name')}>{name}</p>
          <p className={cx('desc')}>{description}</p>
        </div>
        <AvatarGroup max={4} total={members.length}>
          {members.map((member) => (
            <Avatar key={member.id} src={member.photoURL} alt={member.displayName} />
          ))}
        </AvatarGroup>
      </header>
      <div className={cx('inner')}>
        <div className={cx('msg-field')}>
          {messages.map((message, index, messages) => {
            const prevUid = messages[index - 1]?.uid;
            const nextUid = messages[index + 1]?.uid;
            return (
              <div className={cx('msg-container', message.uid === uid ? 'user-msg' : '')} key={message.id}>
                {prevUid === message.uid || (
                  <Avatar src={message.photoURL} alt={message.displayName} className={cx('msg-avatar')} />
                )}
                <div
                  className={cx(
                    'msg-text',
                    prevUid !== message.uid ? 'first-text' : '',
                    nextUid !== message.uid ? 'last-text' : '',
                  )}
                >
                  <p className={cx('msg-text-content')}>{message.text}</p>
                  {nextUid === message.uid || (
                    <span className={cx('msg-time')}>{formatDate(message.createAt?.seconds)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <form className={cx('reply-field')} onSubmit={handleSendMessage}>
          <input
            className={cx('reply-input')}
            placeholder="Enter your message here..."
            onChange={(e) => {
              setMessageValue(e.target.value);
            }}
            value={messageValue}
          />
          <div className={cx('reply-btns')}>
            <IconButton className={cx('reply-btn')}>
              <FontAwesomeIcon icon={faFaceGrinWide} className={cx('icon')} />
            </IconButton>
            <IconButton className={cx('reply-btn')}>
              <FontAwesomeIcon icon={faPaperclip} className={cx('icon')} />
            </IconButton>
            <IconButton className={cx('reply-btn', 'send-btn')} onClick={handleSendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} className={cx('icon')} />
            </IconButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;
