import classNames from 'classnames/bind';
import { useContext } from 'react';
import { Avatar, Tooltip, Zoom } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { faRotateLeft, faQuoteRight, faShare, faDownload } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Message.module.scss';
import { formatDate, formatFileSize } from '../../../../utilities';
import heartIcon from '../../../../assets/images/heart-icon.png';
import { db } from '../../../../firebase/config';
import { AuthContext } from '../../../../Context/AuthProvider';
import { AppContext } from '../../../../Context/AppProvider';
import MessageContent from './MessageContent';
import type { messageType, shareMsgType } from '../../../../hooks/useFireStoreGetMessages';

const cx = classNames.bind(styles);
type Props = {
  message: messageType;
  index: number;
  messages: messageType[];
  setQuote: React.Dispatch<React.SetStateAction<shareMsgType>>;
};

const rotateLeftIcon = faRotateLeft as IconProp
const downloadIcon = faDownload as IconProp
const shareIcon = faShare as IconProp
const quoteRightIcon = faQuoteRight as IconProp

function Message({ message, index, messages, setQuote }: Props) {
  const { setShareMessage } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  // Heart drop
  const addHeartDrop = () => {
    updateDoc(doc(db, 'messages', message.id), {
      hearts: [...message.hearts, user.uid],
    });
  };
  // Create quote for Quoting and Sharing
  const handleCreateQuoteMessage = (
    message: messageType,
    callback: React.Dispatch<React.SetStateAction<shareMsgType>>,
  ) => {
    if (message.application) {
      callback({
        ...message.application,
        displayName: message.displayName,
        id: message.id,
      });
    } else if (message.image) {
      callback({
        ...message.image,
        displayName: message.displayName,
        id: message.id,
      });
    } else if (message.video) {
      callback({
        ...message.video,
        displayName: message.displayName,
        id: message.id,
      });
    } else {
      callback({
        name: message.text,
        type: message.type,
        displayName: message.displayName,
        id: message.id,
        size: 0,
        downloadURL: '',
      });
    }
  };
  // Revoke Message
  const revokeMessage = (message: messageType) => {
    updateDoc(doc(db, 'messages', message.id), {
      type: 'revoke',
      beforeRevoke: message.type,
    });
  };
  // Undo Revoking Message
  const undoRevokeMessage = (message: messageType) => {
    updateDoc(doc(db, 'messages', message.id), {
      type: message.beforeRevoke,
      beforeRevoke: '',
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
  // Revoke messages
  if (message.type === 'revoke') {
    const prevUid = messages[index - 1]?.uid;
    const nextUid = messages[index + 1]?.uid;
    return (
      <div className={cx('msg-container', message.uid === user.uid ? 'user-msg' : '')} id={message.uid}>
        {prevUid === message.uid || (
          <Avatar src={message.photoURL} alt={message.displayName} className={cx('msg-avatar')}>
            {message.photoURL ? '' : message.displayName.charAt(0).toUpperCase()}
          </Avatar>
        )}
        <div
          className={cx(
            'msg-inner',
            'revoke',
            prevUid !== message.uid ? 'first-msg' : '',
            nextUid !== message.uid ? 'last-msg' : '',
          )}
        >
          {<p>Message has been revoked</p>}
          <div className={cx('actions')}>
            {message.uid === user.uid && (
              <Tooltip
                title="Undo Revoke"
                TransitionComponent={Zoom}
                PopperProps={{ sx: { '& .MuiTooltip-tooltip': { fontSize: 10 } } }}
              >
                <button className={cx('action-btn')} onClick={() => undoRevokeMessage(message)}>
                  <FontAwesomeIcon icon={rotateLeftIcon} />
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    );
  }
  // Default messages
  const prevUid = messages[index - 1]?.uid;
  const nextUid = messages[index + 1]?.uid;
  return (
    <div className={cx('msg-container', message.uid === user.uid ? 'user-msg' : '')} id={message.uid}>
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
            <img src={message.image?.downloadURL} alt={message.image?.name} />
            <a
              className={cx('download-btn')}
              href={message.image?.downloadURL}
              download
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={downloadIcon} />
            </a>
          </div>
        )}
        {message.type === 'video' && (
          <>
            <video className={cx('video-message')} controls>
              <source src={message.video?.downloadURL} type={message.video?.type} />
            </video>
            <div className={cx('video-info')}>
              <p>File name: {message.video?.name}</p>
              <p>Size: {formatFileSize(message.video?.size || 0)}</p>
            </div>
          </>
        )}
        {message.comment && <p className={cx('comment')}>{message.comment}</p>}
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
            <button className={cx('action-btn', 'quote')} onClick={() => handleCreateQuoteMessage(message, setQuote)}>
              <FontAwesomeIcon icon={quoteRightIcon} />
            </button>
          </Tooltip>
          <Tooltip
            title="Share"
            TransitionComponent={Zoom}
            PopperProps={{ sx: { '& .MuiTooltip-tooltip': { fontSize: 10 } } }}
          >
            <button
              className={cx('action-btn', 'share')}
              onClick={() => handleCreateQuoteMessage(message, setShareMessage)}
            >
              <FontAwesomeIcon icon={shareIcon} />
            </button>
          </Tooltip>
          {message.uid === user.uid && (
            <Tooltip
              title="Revoke"
              TransitionComponent={Zoom}
              PopperProps={{ sx: { '& .MuiTooltip-tooltip': { fontSize: 10 } } }}
            >
              <button className={cx('action-btn', 'revoke')} onClick={() => revokeMessage(message)}>
                <FontAwesomeIcon icon={rotateLeftIcon} />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
