import { useContext } from 'react';
import { Avatar, Tooltip } from '@mui/material';
import classNames from 'classnames/bind';

import styles from './Message.module.scss';
import { AuthContext } from '~/Context/AuthProvider';
import { formatDate, formatFileSize } from '~/utilities';
import heartIcon from '~/assets/images/heart-icon.png';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase/config';
import MessageContent from './MessageContent';
import { faRotateLeft, faQuoteRight, faShare, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Zoom } from '@mui/material';

const cx = classNames.bind(styles);
function Message({ message, index, messages, setQuote }) {
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
    <div className={cx('msg-container', message.uid === uid ? 'user-msg' : '')} id={message.uid}>
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
        {(message.type === 'message' || message.type === 'application') && <MessageContent message={message} />}
        {message.type === 'image' && (
          <div className={cx('img-message')}>
            <img src={message.image.downloadURL} alt={message.image.name} />
            <a
              className={cx('download-btn')}
              href={message.image.downloadURL}
              download
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faDownload} />
            </a>
          </div>
        )}
        {message.type === 'video' && (
          <>
            <video className={cx('video-message')} controls>
              <source src={message.video.downloadURL} type={message.video.type} />
            </video>
            <div className={cx('video-info')}>
              <p>File name: {message.video.name}</p>
              <p>Size: {formatFileSize(message.video.size)}</p>
            </div>
          </>
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
        <div className={cx('actions')}>
          <Tooltip
            title="Quote"
            TransitionComponent={Zoom}
            PopperProps={{ sx: { '& .MuiTooltip-tooltip': { fontSize: 10 } } }}
          >
            <button
              className={cx('action-btn', 'quote')}
              onClick={() => {
                if (message.application) {
                  setQuote({
                    text: message.application.name,
                    type: message.application.type,
                    name: message.displayName,
                    id: message.id,
                  });
                } else if (message.image) {
                  setQuote({
                    text: message.image.name,
                    type: message.image.type,
                    url: message.image.downloadURL,
                    name: message.displayName,
                    id: message.id,
                  });
                } else if (message.video) {
                  setQuote({
                    text: message.video.name,
                    type: message.video.type,
                    url: message.video.downloadURL,
                    name: message.displayName,
                    id: message.id,
                  });
                } else {
                  setQuote({ text: message.text, type: message.type, name: message.displayName, id: message.id });
                }
              }}
            >
              <FontAwesomeIcon icon={faQuoteRight} />
            </button>
          </Tooltip>
          <Tooltip
            title="Share"
            TransitionComponent={Zoom}
            PopperProps={{ sx: { '& .MuiTooltip-tooltip': { fontSize: 10 } } }}
          >
            <button className={cx('action-btn', 'share')}>
              <FontAwesomeIcon icon={faShare} />
            </button>
          </Tooltip>
          {message.uid === uid && (
            <Tooltip
              title="Revoke"
              TransitionComponent={Zoom}
              PopperProps={{ sx: { '& .MuiTooltip-tooltip': { fontSize: 10 } } }}
            >
              <button className={cx('action-btn', 'revoke')}>
                <FontAwesomeIcon icon={faRotateLeft} />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
