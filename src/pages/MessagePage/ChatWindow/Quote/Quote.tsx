import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames/bind';

import styles from './Quote.module.scss';
import { fileIcons } from '../../../../Constants';
import type { shareMsgType } from '../../../../hooks/useFireStoreGetMessages';
import { closeIcon } from '../../../../modals/AddGroupModal/AddGroupModal';

const cx = classNames.bind(styles);

const quoteLeftIcon = faQuoteLeft as IconProp

type Props = {
  quote: shareMsgType,
  setQuote: React.Dispatch<React.SetStateAction<shareMsgType>>,
}
function Quote({ quote, setQuote }: Props) {
  return (
    <div className={cx('container')}>
      <div className={cx('inner')}>
        {quote.type === 'application/pdf' && (
          <img src={fileIcons[quote.type]} className={cx('file-icon')} alt="file-icon" />
        )}
        {quote.type === 'application/msword' && (
          <img src={fileIcons[quote.type]} className={cx('file-icon')} alt="file-icon" />
        )}
        {quote.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
          <img src={fileIcons[quote.type]} className={cx('file-icon')} alt="file-icon" />
        )}
        {quote.type.split('/')[0] === 'image' && (
          <img src={quote.downloadURL} className={cx('quote-img')} alt="file-icon" />
        )}
        {quote.type === 'video/mp4' && (
          <img src={fileIcons[quote.type]} className={cx('quote-img')} alt="file-icon" />
        )}
        <div className={cx('quote-content')}>
          <header className={cx('quote-header')}>
            <FontAwesomeIcon icon={quoteLeftIcon} />
            <p>Quote</p>
          </header>
          <p className={cx('quote-msg')}>{quote.name}</p>
        </div>
        <button className={cx('close-btn')} onClick={() => setQuote({id: '', displayName: '', type: '', size: 0, downloadURL: '', name: ''})}>
          <FontAwesomeIcon icon={closeIcon} />
        </button>
      </div>
    </div>
  );
}

export default Quote;
