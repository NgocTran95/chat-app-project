import classNames from 'classnames/bind';

import styles from './MessagePage.module.scss'
import ChatWindow from '~/components/ChatWindow';
import Leftbar from '~/components/Leftbar';
import Rightbar from '~/components/Rightbar';

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
