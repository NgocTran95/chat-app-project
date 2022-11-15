import classNames from 'classnames/bind';
import styles from './FileList.module.scss';
import { Avatar, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faDownload } from '@fortawesome/free-solid-svg-icons';
import { formatFileSize } from '~/utilities';
import { fileIcons } from '~/Constants';
import { useState } from 'react';

const cx = classNames.bind(styles);
function FileList({ icon, name, totals }) {
  const { totalNum, totalSize, files } = totals;
  const [show, setShow] = useState(false);
  const toggleShowFiles = () => {
    setShow((prev) => !prev);
  };
  return (
    <div className={cx('container')}>
      <div className={cx('header')}>
        <Avatar sx={{ width: 50, height: 50 }}>
          <FontAwesomeIcon icon={icon} className={cx('avatar-icon')} />
        </Avatar>
        <div className={cx('files-info')}>
          <h5 className={cx('files-type')}>{name}</h5>
          <p className={cx('files-qtt')}>{totalNum} files</p>
        </div>
        <p className={cx('files-size')}>{formatFileSize(totalSize)}</p>
        <IconButton className={cx('files-more')} onClick={toggleShowFiles}>
          <FontAwesomeIcon icon={show ? faChevronDown : faChevronRight} />
        </IconButton>
      </div>
      <div className={cx('list', show && 'show')}>
        {files.map((file) => (
          <div className={cx('file')} key={file.name}>
            <div className={cx('file-avatar')}>
              <img src={fileIcons[file.type]} alt={file.name} />
            </div>
            <div className={cx('file-info')}>
              <p className={cx('name')}>{file.name}</p>
              <p className={cx('size')}>{formatFileSize(file.size)}</p>
            </div>
            <a className={cx('download-btn')} href={file.downloadURL} download target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faDownload} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileList;
