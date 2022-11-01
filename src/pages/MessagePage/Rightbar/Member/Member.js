import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@mui/material';
import { faMicrophoneSlash, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Member.module.scss';
import ProfileAvatar from '~/components/ProfileAvatar';
import { statusColors } from '~/Constants';
import { useContext } from 'react';
import { AppContext } from '~/Context/AppProvider';

const cx = classNames.bind(styles);
function Member({ photoURL, displayName, status, uid }) {
  const { isAdmin, setIsOpenRemoveMember, setRemoveMember } = useContext(AppContext);

  return (
    <div className={cx('container')}>
      <ProfileAvatar name={displayName} image={photoURL} status={status} width={36} height={36} />
      <div className={cx('info')}>
        <h4 className={cx('name')}>{displayName}</h4>
        <p className={cx('status')} style={{ color: statusColors[status] }}>
          {status}
        </p>
      </div>
      <div className={cx('actions')}>
        <IconButton className={cx('action-btn', 'microphone')}>
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
            <FontAwesomeIcon icon={faCircleXmark} className={cx('icon')} />
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default Member;
