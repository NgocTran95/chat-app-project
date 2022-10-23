import { IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './ChatFiles.module.scss';
import { faCaretDown, faCaretLeft, faFileLines, faFileImage, faFilm, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import ChatFile from '../ChatFile';

const cx = classNames.bind(styles);
function ChatFiles() {
  const [expanded, setExpanded] = useState(true);
  const handleToggleList = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <div>
      <header className={cx('header')}>
        <h5 className={cx('title')}>Chat Files</h5>

        <div className={cx('tools')}>
          <IconButton className={cx('btn')} onClick={handleToggleList}>
            <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretLeft} />
          </IconButton>
        </div>
      </header>
      <div className={cx('chat-files', expanded ? 'show' : '')}>
        <ChatFile icon={faFileLines} name="Documents" quantity={8} size={2.45} />
        <ChatFile icon={faFileImage} name="Images" quantity={13} size={9.77} />
        <ChatFile icon={faFilm} name="Videos" quantity={2} size={46.66} />
        <ChatFile icon={faFile} name="Attachments" quantity={7} size={0.45} />
      </div>
    </div>
  );
}

export default ChatFiles;
