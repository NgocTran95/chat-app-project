import classNames from 'classnames/bind';

import styles from './MessagePage.module.scss';
import ChatWindow from './ChatWindow';
import Leftbar from './Leftbar';
import Rightbar from './Rightbar';

const cx = classNames.bind(styles);

function MessagePage() {
  return (
    <div className={cx('container')}>
      <Leftbar />
      <ChatWindow />
      <Rightbar />
    </div>
  );
}

export default MessagePage;
