import classNames from 'classnames/bind';
import { useContext, useMemo } from 'react';

import styles from './ChatRoom.module.scss';
import ProfileAvatar from '~/components/ProfileAvatar';
import { AppContext } from '~/Context/AppProvider';
import { useFireStore } from '~/hooks/useFireStore';

const cx = classNames.bind(styles);
function ChatRoom({ name, id }) {
  const { setSelectedRoomId, selectedRoomId } = useContext(AppContext);

  // Got last message in this room
  const messagesCondition = useMemo(() => {
    return {
      fieldName: 'roomId',
      operator: '==',
      compareValue: id,
    };
  }, [id]);
  const messages = useFireStore('messages', messagesCondition);
  const lastMessages = useMemo(() => {
    return messages[messages.length - 1];
  }, [messages]);
  return (
    <div className={cx('container', `${id === selectedRoomId ? 'active' : ''}`)} onClick={() => setSelectedRoomId(id)}>
      <ProfileAvatar
        status="Online"
        image="https://d1nslcd7m2225b.cloudfront.net/Pictures/1024x536/2/4/4/1230244_Minions+3.jpg"
        width={50}
        height={50}
      />
      <div className={cx('infor')}>
        <div className={cx('group-name')}>{name}</div>
        {!!lastMessages && (
          <p className={cx('last-msg')}>
            <span className={cx('person')}>{lastMessages?.displayName?.slice(0, lastMessages?.displayName?.indexOf(' '))}: </span>
            <span className={cx('content')}>{lastMessages?.text}</span>
          </p>
        )}
      </div>
      {/* <span className={cx('unread-msg')}>3</span> */}
    </div>
  );
}

export default ChatRoom;
