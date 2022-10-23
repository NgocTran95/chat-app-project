import classNames from 'classnames/bind';
import ProfileAvatar from '~/components/ProfileAvatar';
import styles from './ChatRoom.module.scss';

const cx = classNames.bind(styles);
function ChatRoom({ isActive, name }) {
  return (
    <div className={cx('container', `${isActive ? 'active' : ''}`)}>
      <ProfileAvatar
        status="Online"
        image="https://d1nslcd7m2225b.cloudfront.net/Pictures/1024x536/2/4/4/1230244_Minions+3.jpg"
        width={50}
        height={50}
      />
      <div className={cx('infor')}>
        <div className={cx('group-name')}>{name}</div>
        <p className={cx('last-msg')}>
          <span className="person">Me</span>: <span className={cx('content')}>Hey Jeff, come on! Where r u now?</span>
        </p>
      </div>
      <span className={cx('unread-msg')}>3</span>
    </div>
  );
}

export default ChatRoom;
