import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@mui/material';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faMicrophoneSlash, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';

import styles from './Member.module.scss';
import ProfileAvatar from '../../../../components/ProfileAvatar';
import { AppContext } from '../../../../Context/AppProvider';
import { formatOfflineTime } from '../../../../utilities';
import type { userType } from '../../../../hooks/useFireStoreGetUsers';

const cx = classNames.bind(styles);

const microPhoneSlashIcon = faMicrophoneSlash as IconProp;
const circleXmarkIcon = faCircleXmark as IconProp;

function Member({ photoURL, displayName, status, uid }: userType) {
  const { isAdmin, setIsOpenRemoveMember, setRemoveMember, toastMessage, setToastMessage } = useContext(AppContext);
  const sendMessage = () => {
    setToastMessage({ ...toastMessage, open: true, message: 'This feature will be updated soon', severity: 'error' });
  };
  return (
    <div className={cx('container')}>
      <ProfileAvatar name={displayName} image={photoURL} status={status.state} width={36} height={36} />
      <div className={cx('info')}>
        <h4 className={cx('name')}>{displayName}</h4>
        <div className={cx('status')} style={{ color: status.state === 'Online' ? '#44b700' : '#afbbc6' }}>
          {status.state}
          {status.state === 'Online' ? '' : <p>{`${formatOfflineTime(status.last_changed.seconds)} ago`}</p>}
        </div>
      </div>
      <div className={cx('actions')}>
        <IconButton className={cx('action-btn', 'microphone')} onClick={sendMessage}>
          <FontAwesomeIcon icon={microPhoneSlashIcon} className={cx('icon')} />
        </IconButton>
        {isAdmin && (
          <IconButton
            className={cx('action-btn')}
            onClick={() => {
              setIsOpenRemoveMember(true);
              setRemoveMember({ displayName, uid });
            }}
          >
            <FontAwesomeIcon icon={circleXmarkIcon} className={cx('icon', 'remove')} />
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default Member;
