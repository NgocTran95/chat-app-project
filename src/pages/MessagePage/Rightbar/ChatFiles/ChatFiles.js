import { IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './ChatFiles.module.scss';
import { faCaretDown, faCaretLeft, faFileLines, faFileImage, faFilm } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useContext, useMemo, useState } from 'react';
import ChatFile from '../ChatFile';
import { AppContext } from '~/Context/AppProvider';

const cx = classNames.bind(styles);
function ChatFiles() {
  const [expanded, setExpanded] = useState(true);
  const { messages } = useContext(AppContext)
  
  // const documentFiles = useMemo(() => {
  //   return messages.filter(message => message.type.split('/')[0] === 'application')
  // }, [messages])
  // const totalDocumentsSize = useMemo(() => {
  //   return documentFiles.reduce((total, file) => total += file.fileSize, 0)
  // }, [documentFiles])

  const calculateFolderSize = useCallback((type) => {
    const files = messages.filter(message => message.type.split('/')[0] === type)
    const totalSize = files.reduce((total, file) => total += file[type].size, 0)
    const totalNum = files.reduce((total, file) => total += 1, 0)
    return {totalSize, totalNum}
  },[messages])

  const totalDocuments = useMemo(() => {
    return calculateFolderSize('application')
  }, [calculateFolderSize])

  const totalImages = useMemo(() => {
    return calculateFolderSize('image')
  }, [calculateFolderSize])

  const totalVideos = useMemo(() => {
    return calculateFolderSize('video')
  }, [calculateFolderSize])


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
        <ChatFile icon={faFileLines} name="Documents" quantity={totalDocuments.totalNum} size={totalDocuments.totalSize} />
        <ChatFile icon={faFileImage} name="Images" quantity={totalImages.totalNum} size={totalImages.totalSize} />
        <ChatFile icon={faFilm} name="Videos" quantity={totalVideos.totalNum} size={totalVideos.totalSize} />
      </div>
    </div>
  );
}

export default ChatFiles;
