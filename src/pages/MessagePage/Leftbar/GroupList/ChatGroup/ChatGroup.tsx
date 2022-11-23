import classNames from 'classnames/bind';
import { useContext, useMemo } from 'react';
import { Avatar } from '@mui/material';

import styles from './ChatGroup.module.scss';
import { AppContext } from '../../../../../Context/AppProvider';
import { useFireStoreGetMessages } from '../../../../../hooks/useFireStoreGetMessages';
import type { condition } from '../../../../../hooks/useFireStoreGetMessages';

const cx = classNames.bind(styles);
type Props = {
  name: string;
  id: string;
  avatarURL: string;
};
function ChatGroup({ name, id, avatarURL }: Props) {
  const { setSelectedGroupId, selectedGroupId } = useContext(AppContext);

  // Got last message in this group
  const messagesCondition: condition = useMemo(() => {
    return {
      fieldName: 'groupId',
      operator: '==',
      compareValue: id,
    };
  }, [id]);
  const messages = useFireStoreGetMessages(messagesCondition);
  const lastMessages = useMemo(() => {
    return messages[messages.length - 1];
  }, [messages]);
  return (
    <div
      className={cx('container', `${id === selectedGroupId ? 'active' : ''}`)}
      onClick={() => setSelectedGroupId(id)}
    >
      <Avatar src={avatarURL} sx={{ width: 50, height: 50 }} alt={name}>
        {avatarURL ? '' : name.charAt(0).toUpperCase()}
      </Avatar>
      <div className={cx('infor')}>
        <div className={cx('group-name')}>{name}</div>
        {!!lastMessages && (
          <p className={cx('last-msg')}>
            <span className={cx('person')}>
              {lastMessages.displayName.slice(0, lastMessages.displayName.indexOf(' '))}:{' '}
            </span>
            <span className={cx('content')}>{lastMessages.text}</span>
          </p>
        )}
      </div>
      {/* <span className={cx('unread-msg')}>3</span> */}
    </div>
  );
}

export default ChatGroup;
