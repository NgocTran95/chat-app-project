import classNames from 'classnames/bind';
import styles from './ChatFile.module.scss';
import { Avatar, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
function ChatFile({ icon, name, quantity, size}) {
  return (
    <div className={cx('chat-file')}>
      <Avatar sx={{ width: 50, height: 50 }}>
        <FontAwesomeIcon icon={icon} className={cx('avatar-icon')} />
      </Avatar>
      <div className={cx('files-info')}>
        <h5 className={cx('files-type')}>{name}</h5>
        <p className={cx('files-qtt')}>{quantity} files</p>
      </div>
      <p className={cx('files-size')}>{size}MB</p>
      <IconButton className={cx('files-more')}>
        <FontAwesomeIcon icon={faChevronRight} />
      </IconButton>
    </div>
  );
}

export default ChatFile;
