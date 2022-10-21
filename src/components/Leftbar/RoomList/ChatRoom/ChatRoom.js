import classNames from 'classnames/bind';
import ProfileAvatar from '~/components/ProfileAvatar';
import styles from './ChatRoom.module.scss';

const cx = classNames.bind(styles);
function ChatRoom({ isActive }) {
  return (
    <div className={cx('container', `${isActive ? 'active' : ''}`)}>
      <ProfileAvatar
        status="Online"
        image="https://theimportantsite.com/wp-content/uploads/2020/04/family-1466262_1280-2.jpg"
        width={50}
        height={50}
      />
      <div className={cx('infor')}>
        <div className={cx('group-name')}>Funny Friends</div>
        <p className={cx('last-msg')}>
          <span className="person">Me</span>: <span className={cx('content')}>Hey Jeff, come on! Where r u now?</span>
        </p>
      </div>
      <span className={cx('unread-msg')}>3</span>
    </div>
  );
}

export default ChatRoom;
