import { IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './ChatFiles.module.scss';
import {
  faCaretDown,
  faCaretLeft,
  faFileLines,
  faFileImage,
  faFilm,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import ChatFile from '../ChatFile';

const cx = classNames.bind(styles);
function ChatFiles({ isOpen }) {
  const [expanded, setExpanded] = useState(true);
  const handleToggleList = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <div>
      <header className={cx('header', isOpen ? '' : 'small')}>
        <h5 className={cx('title')}>{isOpen ? <span>Chat Files</span> : <span>Files</span>}</h5>
        {isOpen && (
          <div className={cx('tools')}>
            <IconButton className={cx('btn')} onClick={handleToggleList}>
              <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretLeft} />
            </IconButton>
          </div>
        )}
      </header>
      <div className={cx('chat-files', expanded ? 'show' : '', isOpen ? '' : 'small')}>
        <ChatFile icon={faFileLines} name="Documents" quantity={8} size={2.45} isOpen={isOpen}/>
        <ChatFile icon={faFileImage} name="Images" quantity={13} size={9.77} isOpen={isOpen}/>
        <ChatFile icon={faFilm} name="Videos" quantity={2} size={46.66} isOpen={isOpen}/>
        <ChatFile icon={faFile} name="Attachments" quantity={7} size={0.45} isOpen={isOpen}/>
      </div>
    </div>
  );
}

export default ChatFiles;
