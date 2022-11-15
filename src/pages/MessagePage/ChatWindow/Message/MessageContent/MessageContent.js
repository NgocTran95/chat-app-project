import classNames from 'classnames/bind';
import styles from './MessageContent.module.scss';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatFileSize } from '~/utilities';
import { fileIcons } from '~/Constants';

const cx = classNames.bind(styles);
function MessageContent({ message }) {
  if (message.type === 'application') {
    return (
      <div className={cx('container')}>
        <img src={fileIcons[message.application.type]} className={cx('file-icon')} alt="file-icon" />
        <div className={cx('file-info')}>
          <p className={cx('file-name')}>{message.application.name}</p>
          <p className={cx('file-size')}>{formatFileSize(message.application.size)}</p>
        </div>
        <a
          className={cx('download-btn')}
          href={message.application.downloadURL}
          download
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faDownload} />
        </a>
      </div>
    );
  }
  //eslint-disable-next-line
  const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  return (
    <>
      {!!message.quote && (
        <div className={cx('quote')}>
          <div className={cx('quote-inner')}>
            {message.quote.type.split('/')[0] === 'application' && (
              <img src={fileIcons[message.quote.type]} className={cx('quote-file-icon')} alt="file-icon" />
            )}
            {message.quote.type.split('/')[0] === 'image' && (
              <img src={message.quote.downloadURL} className={cx('quote-image-icon')} alt={message.quote.name} />
            )}
            {message.quote.type.split('/')[0] === 'video' && (
              <img src={fileIcons[message.quote.type]} className={cx('quote-file-icon')} alt="file-icon" />
            )}
            <div className={cx('quote-content')}>
              <p>{message.quote.displayName}</p>
              <p className={cx('quote-msg')}>{message.quote.name}</p>
            </div>
          </div>
        </div>
      )}
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
