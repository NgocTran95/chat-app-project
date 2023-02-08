import classNames from 'classnames/bind';
import styles from './MessageContent.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { formatFileSize } from '../../../../../utilities';
import { fileIcons } from '../../../../../Constants';
import type { messageType } from '../../../../../hooks/useFireStoreGetMessages';

const cx = classNames.bind(styles);

type Props = {
  message: messageType;
};

const downloadIcon = faDownload as IconProp;

function MessageContent({ message }: Props) {
  if (message.type === 'application') {
    return (
      <div className={cx('container')}>
        {message.application?.type === 'application/pdf' && (
          <img src={fileIcons[message.application.type]} className={cx('file-icon')} alt="file-icon" />
        )}
        {message.application?.type === 'application/msword' && (
          <img src={fileIcons[message.application.type]} className={cx('file-icon')} alt="file-icon" />
        )}
        {message.application?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
          <img src={fileIcons[message.application.type]} className={cx('file-icon')} alt="file-icon" />
        )}
        <div className={cx('file-info')}>
          <p className={cx('file-name')}>{message.application?.name}</p>
          <p className={cx('file-size')}>{formatFileSize(message.application?.size || 0)}</p>
        </div>
        <a
          className={cx('download-btn')}
          href={message.application?.downloadURL}
          download
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={downloadIcon} />
        </a>
      </div>
    );
  }
  //eslint-disable-next-line
  const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  return (
    <>
      {!!message.quote?.id && (
        <div className={cx('quote')}>
          <div className={cx('quote-inner')}>
            {message.quote.type === 'application/pdf' && (
              <img src={fileIcons[message.quote.type]} className={cx('quote-file-icon')} alt="file-icon" />
            )}
            {message.quote.type === 'application/msword' && (
              <img src={fileIcons[message.quote.type]} className={cx('quote-file-icon')} alt="file-icon" />
            )}
            {message.quote.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
              <img src={fileIcons[message.quote.type]} className={cx('quote-file-icon')} alt="file-icon" />
            )}
            {message.quote.type.split('/')[0] === 'image' && (
              <img src={message.quote.downloadURL} className={cx('quote-image-icon')} alt={message.quote.name} />
            )}
            {message.quote.type === 'video/mp4' && (
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
