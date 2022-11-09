import classNames from 'classnames/bind';
import styles from './MessageContent.module.scss';
import docIcon from '~/assets/images/doc-icon.svg';
import imageIcon from '~/assets/images/image-icon.svg';
import mp4Icon from '~/assets/images/mp4-icon.svg';
import pdfIcon from '~/assets/images/pdf-icon.svg';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatFileSize } from '~/utilities';

const fileIcons = {
    'application/pdf': pdfIcon,
    'application/msword': docIcon,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': docIcon,
    'video/mp4': mp4Icon,
    'image/png': imageIcon,
    'image/jpeg': imageIcon,
}

const cx = classNames.bind(styles);
function MessageContent({ message }) {
  if (message.type !== 'message') {
    return (
      <div className={cx('container')}>
        <img src={fileIcons[message.type]} className={cx('file-icon')} alt="file-icon" />
        <div className={cx('file-info')}>
          <p className={cx('file-name')}>{message.fileName}</p>
          <p className={cx('file-size')}>{formatFileSize(message.fileSize)}</p>
        </div>
        <a className={cx('download-btn')} href={message.fileUrl} download target='_blank' rel="noreferrer">
          <FontAwesomeIcon icon={faDownload} />
        </a>
      </div>
    );
  }
  //eslint-disable-next-line
  const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  return (
    <>
      {urlRegex.test(message.text) ? (
        <a className={cx('msg-text')} href={message.text} target="_blank" rel="noreferrer">
          {message.text}
        </a>
      ) : (
        <p className={cx('msg-text')}>{message.text}</p>
      )}
    </>
  );
}

export default MessageContent;
