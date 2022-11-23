import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPaperclip, faPaperPlane, faFaceGrinWide } from '@fortawesome/free-solid-svg-icons';
import { Avatar, AvatarGroup, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import { useContext, useRef, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import EmojiPicker from 'emoji-picker-react';

import styles from './ChatWindow.module.scss';
import Message from './Message';
import UploadFile from './UploadFile';
import Quote from './Quote';
import nonChatBg from '../../../assets/images/non-chat-bg.jpg';
import { db } from '../../../firebase/config';
import { AuthContext } from '../../../Context/AuthProvider';
import { AppContext } from '../../../Context/AppProvider';
import type { shareMsgType } from '../../../hooks/useFireStoreGetMessages';

const cx = classNames.bind(styles);

const paperClipIcon = faPaperclip as IconProp
const paperPlaneIcon = faPaperPlane as IconProp
const faceGrinWideIcon = faFaceGrinWide as IconProp

function ChatWindow() {
  const [messageValue, setMessageValue] = useState<string>('');
  const [isShowEmoji, setIsShowEmoji] = useState<boolean>(false);
  const [isOpenUploadFile, setIsOpenUploadFile] = useState<boolean>(false);
  const [quote, setQuote] = useState<shareMsgType>({id: '', displayName: '', type: '', size: 0, downloadURL: '', name: ''});
  const { selectedGroup, selectedGroupId, modifiedMembers, messages, emailUserDisplayName } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const { uid, photoURL, displayName } = user;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageFieldRef = useRef<HTMLDivElement | null>(null);
  if (selectedGroupId === '')
    return (
      <div className={cx('container')}>
        <img className={cx('nonchat-bg')} src={nonChatBg} alt="non-chat-bg" />
      </div>
    );
  const { name, description } = selectedGroup;

  const handleStopEvent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpenUploadFile(true);
  };

  const scrollToBottom = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>|React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
    }).then(() => {
      scrollToBottom(messageFieldRef);
    });
    setMessageValue('');
    setQuote({id: '', displayName: '', type: '', size: 0, downloadURL: '', name: ''});
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setMessageValue((prevMsg) => prevMsg + emojiData.emoji);
    setIsShowEmoji(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
          ref={messageFieldRef}
        >
          {messages.map((message, index, messages) => (
            <Message key={message.id} message={message} index={index} messages={messages} setQuote={setQuote} />
          ))}
        </div>
        {quote.id !== '' && <Quote quote={quote} setQuote={setQuote} />}
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
              <FontAwesomeIcon icon={faceGrinWideIcon} className={cx('icon')} />
            </IconButton>
            <IconButton className={cx('reply-btn')} onClick={() => setIsOpenUploadFile(true)}>
              <FontAwesomeIcon icon={paperClipIcon} className={cx('icon')} />
            </IconButton>
            <IconButton className={cx('reply-btn', 'send-btn')} onClick={(e) =>handleSendMessage(e)}>
              <FontAwesomeIcon icon={paperPlaneIcon} className={cx('icon')} />
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
