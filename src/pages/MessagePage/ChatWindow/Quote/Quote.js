import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Quote.module.scss';
import { fileIcons } from '~/constants';

const cx = classNames.bind(styles);
function Quote({ quote, setQuote }) {
  return (
    <div className={cx('container')}>
      <div className={cx('inner')}>
        {quote.type.split('/')[0] === 'application' && (
          <img src={fileIcons[quote.type]} className={cx('file-icon')} alt="file-icon" />
        )}
        {quote.type.split('/')[0] === 'image' && (
          <img src={quote.url} className={cx('quote-img')} alt="file-icon" />
        )}
        {quote.type.split('/')[0] === 'video' && (
          <img src={fileIcons[quote.type]} className={cx('quote-img')} alt="file-icon" />
        )}
        <div className={cx('quote-content')}>
          <header className={cx('quote-header')}>
            <FontAwesomeIcon icon={faQuoteLeft} />
            <p>Quote</p>
          </header>
          <p className={cx('quote-msg')}>{quote.text}</p>
        </div>
        <button className={cx('close-btn')} onClick={() => setQuote(null)}>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
    </div>
  );
}

export default Quote;
