import { Avatar } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './BlockMessage.module.scss';

const cx = classNames.bind(styles);
function BlockMessage({ isUser, image, messages, createAt, name }) {
  return (
    <div className={cx('container', isUser ? 'user-msg' : '')}>
      { !image ? (
        <Avatar className={cx('avatar')}>{name.slice(0, 1)}</Avatar>
      ) : (
        <Avatar className={cx('avatar')} src={image} alt={name} sx={{ width: 44, height: 44 }} />
      )}
      <div className={cx('messages')}>
        {messages.map((message, index) => (
          <p className={cx('message')} key={index}>
            {message}
          </p>
        ))}
        <span className={cx('create-time')}>{createAt}</span>
      </div>
    </div>
  );
}

export default BlockMessage;
