import classNames from 'classnames/bind';
import { Avatar, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faDownload } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useState } from 'react';

import styles from './FileList.module.scss';
import { fileIcons } from '../../../../Constants';
import { formatFileSize } from '../../../../utilities';
import type { totalFiles } from '../../../../Context/AppProvider';

type Props = {
  icon: IconProp;
  name: string;
  totals: totalFiles;
};

const downloadIcon = faDownload as IconProp
const chevronDownIcon = faChevronDown as IconProp
const chevronRightIcon = faChevronRight as IconProp

const cx = classNames.bind(styles);
function FileList({ icon, name, totals }: Props) {
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
          <FontAwesomeIcon icon={show ? chevronDownIcon : chevronRightIcon} />
        </IconButton>
      </div>
      <div className={cx('list', show && 'show')}>
        {files.map((file) => (
          <div className={cx('file')} key={file?.name}>
            <div className={cx('file-avatar')}>
              {file?.type === 'application/pdf' && <img src={fileIcons[file.type]} alt={file?.name} />}
              {file?.type === 'application/msword' && <img src={fileIcons[file.type]} alt={file?.name} />}
              {file?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && <img src={fileIcons[file.type]} alt={file?.name} />}
              {file?.type === 'image/png' && <img src={fileIcons[file.type]} alt={file?.name} />}
              {file?.type === 'image/jpeg' && <img src={fileIcons[file.type]} alt={file?.name} />}
              {file?.type === 'video/mp4' && <img src={fileIcons[file.type]} alt={file?.name} />}
            </div>
            <div className={cx('file-info')}>
              <p className={cx('name')}>{file?.name}</p>
              <p className={cx('size')}>{file?.size && formatFileSize(file.size)}</p>
            </div>
            <a className={cx('download-btn')} href={file?.downloadURL} download target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={downloadIcon} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileList;
