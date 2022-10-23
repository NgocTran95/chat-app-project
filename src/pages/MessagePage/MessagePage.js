import classNames from 'classnames/bind';

import styles from './MessagePage.module.scss'
import ChatWindow from '~/pages/MessagePage/ChatWindow';
import Leftbar from '~/pages/MessagePage/Leftbar';
import Rightbar from '~/pages/MessagePage/Rightbar';

const cx = classNames.bind(styles)

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
