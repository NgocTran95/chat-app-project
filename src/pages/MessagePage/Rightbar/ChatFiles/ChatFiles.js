import { IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './ChatFiles.module.scss';
import { faCaretDown, faCaretLeft, faFileLines, faFileImage, faFilm } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';
import FileList from '../FileList';
import { AppContext } from '~/Context/AppProvider';

const cx = classNames.bind(styles);
function ChatFiles() {
  const [expanded, setExpanded] = useState(true);
  const { totalDocuments, totalImages, totalVideos } = useContext(AppContext);
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
        <FileList icon={faFileLines} name="Documents" totals={totalDocuments} />
        <FileList icon={faFileImage} name="Images" totals={totalImages} />
        <FileList icon={faFilm} name="Videos" totals={totalVideos} />
      </div>
    </div>
  );
}

export default ChatFiles;
