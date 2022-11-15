import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@mui/material';
import { faMicrophoneSlash, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Member.module.scss';
import ProfileAvatar from '~/components/ProfileAvatar';
import { statusColors } from '~/constants';
import { useContext } from 'react';
import { AppContext } from '~/Context/AppProvider';
import { formatOfflineTime } from '~/utilities';

const cx = classNames.bind(styles);
function Member({ photoURL, displayName, status, uid }) {
  const { isAdmin, setIsOpenRemoveMember, setRemoveMember, toastMessage, setToastMessage } = useContext(AppContext);
  const sendMessage = () => {
    setToastMessage({ ...toastMessage, open: true, message: 'This feature will be updated soon', severity: 'error' });
  }
  return (
    <div className={cx('container')}>
      <ProfileAvatar name={displayName} image={photoURL} status={status.state} width={36} height={36} />
      <div className={cx('info')}>
        <h4 className={cx('name')}>{displayName}</h4>
        <div className={cx('status')} style={{ color: statusColors[status.state] }}>
          {status.state}
          {status.state === 'Online' ? '' : <p>{`${formatOfflineTime(status.last_changed.seconds)} ago`}</p>}
        </div>
      </div>
      <div className={cx('actions')}>
        <IconButton className={cx('action-btn', 'microphone')} onClick={sendMessage}>
          <FontAwesomeIcon icon={faMicrophoneSlash} className={cx('icon')} />
        </IconButton>
        {isAdmin && (
          <IconButton
            className={cx('action-btn')}
            onClick={() => {
              setIsOpenRemoveMember(true);
              setRemoveMember({ displayName, uid });
            }}
          >
            <FontAwesomeIcon icon={faCircleXmark} className={cx('icon', 'remove')} />
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default Member;
