import classNames from 'classnames/bind';
import { IconButton } from '@mui/material';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown, faCaretLeft, faFileLines, faFileImage, faFilm } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';

import styles from './ChatFiles.module.scss';
import FileList from '../FileList';
import { AppContext } from '../../../../Context/AppProvider';

export const caretDownIcon = faCaretDown as IconProp;
export const caretLeftIcon = faCaretLeft as IconProp;
export const fileLinesIcon = faFileLines as IconProp;
export const fileImageIcon = faFileImage as IconProp;
export const filmIcon = faFilm as IconProp;

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
            <FontAwesomeIcon icon={expanded ? caretDownIcon : caretLeftIcon} />
          </IconButton>
        </div>
      </header>
      <div className={cx('chat-files', expanded ? 'show' : '')}>
        <FileList icon={fileLinesIcon} name="Documents" totals={totalDocuments} />
        <FileList icon={fileImageIcon} name="Images" totals={totalImages} />
        <FileList icon={filmIcon} name="Videos" totals={totalVideos} />
      </div>
    </div>
  );
}

export default ChatFiles;
