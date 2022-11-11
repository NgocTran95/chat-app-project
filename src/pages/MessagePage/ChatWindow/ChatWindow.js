import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceGrinWide } from '@fortawesome/free-regular-svg-icons';
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Avatar, AvatarGroup, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import { useContext, useRef, useState } from 'react';
import styles from './ChatWindow.module.scss';

import { AppContext } from '~/Context/AppProvider';
import { AuthContext } from '~/Context/AuthProvider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '~/firebase/config';
import EmojiPicker from 'emoji-picker-react';
import nonChatBg from '~/assets/images/non-chat-bg.jpg';
import Message from './Message';
import UploadFile from './UploadFile';
import Quote from './Quote';

const cx = classNames.bind(styles);
function ChatWindow() {
  const [messageValue, setMessageValue] = useState('');
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const [isOpenUploadFile, setIsOpenUploadFile] = useState(false);
  const [quote, setQuote] = useState(null);
  const { selectedGroup, selectedGroupId, modifiedMembers, messages, emailUserDisplayName } = useContext(AppContext);
  const { uid, photoURL, displayName } = useContext(AuthContext);
  const inputRef = useRef();
  if (selectedGroupId === '')
    return (
      <div className={cx('container')}>
        <img className={cx('nonchat-bg')} src={nonChatBg} alt="non-chat-bg" />
      </div>
    );
  const { name, description } = selectedGroup;

  const handleStopEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpenUploadFile(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageValue.trim().length === 0) return;
    addDoc(collection(db, 'messages'), {
      type: 'message',
      quote,
      text: messageValue,
      uid,
      photoURL,
      displayName: displayName || emailUserDisplayName,
      groupId: selectedGroupId,
      createAt: serverTimestamp(),
      hearts: [],
    });
    setMessageValue('');
    setQuote(null);
  };

  const handleEmojiClick = (emojiData) => {
    setMessageValue((prevMsg) => prevMsg + emojiData.emoji);
    setIsShowEmoji(false);
    inputRef.current.focus();
  };
  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <div className={cx('info')}>
          <p className={cx('name')}>{name}</p>
          <p className={cx('desc')}>{description}</p>
        </div>
        <AvatarGroup max={4} total={modifiedMembers.length}>
          {modifiedMembers.map((member) => (
            <Avatar key={member.id} src={member.photoURL} alt={member.displayName} />
          ))}
        </AvatarGroup>
      </header>
      <div className={cx('inner')}>
        <div
          className={cx('msg-field')}
          onDragEnter={handleStopEvent}
          onDragOver={handleStopEvent}
        >
          {messages.map((message, index, messages) => (
            <Message key={message.id} message={message} index={index} messages={messages} setQuote={setQuote} />
          ))}
        </div>
        {!!quote && <Quote quote={quote} setQuote={setQuote} />}
        {isShowEmoji && (
          <div className={cx('emoji')}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <form className={cx('reply-field')} onSubmit={handleSendMessage}>
          <input
            className={cx('reply-input')}
            ref={inputRef}
            placeholder="Enter your message here..."
            onChange={(e) => {
              setMessageValue(e.target.value);
            }}
            value={messageValue}
          />
          <div className={cx('reply-btns')}>
            <IconButton className={cx('reply-btn')} onClick={() => setIsShowEmoji((prev) => !prev)}>
              <FontAwesomeIcon icon={faFaceGrinWide} className={cx('icon')} />
            </IconButton>
            <IconButton className={cx('reply-btn')} onClick={() => setIsOpenUploadFile(true)}>
              <FontAwesomeIcon icon={faPaperclip} className={cx('icon')} />
            </IconButton>
            <IconButton className={cx('reply-btn', 'send-btn')} onClick={handleSendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} className={cx('icon')} />
              <p>Send</p>
            </IconButton>
          </div>
        </form>
      </div>
      {isOpenUploadFile && <UploadFile setIsOpenUploadFile={setIsOpenUploadFile} />}
    </div>
  );
}

export default ChatWindow;
