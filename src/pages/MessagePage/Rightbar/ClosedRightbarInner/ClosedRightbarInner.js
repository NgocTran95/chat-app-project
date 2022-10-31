import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faPhone,
  faVideo,
  faFileLines,
  faFileImage,
  faFilm,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonBase, IconButton, Avatar } from '@mui/material';

import styles from './ClosedRightbarInner.module.scss';
import ProfileAvatar from '~/components/ProfileAvatar';
import { useContext } from 'react';
import { AppContext } from '~/Context/AppProvider';
import { AuthContext } from '~/Context/AuthProvider';
const cx = classNames.bind(styles);
function ClosedRightbarInner({ handleToggleRightBar }) {
  const { modifiedMembers } = useContext(AppContext)
  const { uid } = useContext(AuthContext)
  return (
    <div className={cx('inner')}>
      <header className={cx('header')}>
        <IconButton className={cx('toggle-btn')} onClick={() => handleToggleRightBar()}>
          <FontAwesomeIcon icon={faArrowRight} />
        </IconButton>
      </header>
      <div className={cx('avatar')}>
        <Avatar
          src="https://d1nslcd7m2225b.cloudfront.net/Pictures/1024x536/2/4/4/1230244_Minions+3.jpg"
          sx={{ width: 40, height: 40 }}
          alt="avatar"
        />
      </div>
      <div className={cx('actions')}>
        <ButtonBase className={cx('call-btn', 'voice-chat')}>
          <FontAwesomeIcon icon={faPhone} className={cx('call-icon')} />
        </ButtonBase>
        <ButtonBase className={cx('call-btn', 'video-call')}>
          <FontAwesomeIcon icon={faVideo} className={cx('call-icon')} />
        </ButtonBase>
      </div>
      <div className={cx('members')}>
        <header className={cx('members-header')}>
          <h5 className={cx('members-title')}>People</h5>
        </header>
        <div className={cx('member-list')}>
          {modifiedMembers
            .filter((member) => member.uid !== uid)
            .map((member) => {
              const { uid, displayName, photoURL, status } = member;
              return <ProfileAvatar key={uid} name={displayName} image={photoURL} status={status} width={40} height={40} />;
            })}
        </div>
      </div>
      <div className={cx('files')}>
        <header className={cx('files-header')}>
          <h5 className={cx('files-title')}>Files</h5>
        </header>
        <div className={cx('files-icons')}>
          <Avatar sx={{ width: 40, height: 40 }}>
            <FontAwesomeIcon icon={faFileLines} className={cx('files-icon')} />
          </Avatar>
          <Avatar sx={{ width: 40, height: 40 }}>
            <FontAwesomeIcon icon={faFileImage} className={cx('files-icon')} />
          </Avatar>
          <Avatar sx={{ width: 40, height: 40 }}>
            <FontAwesomeIcon icon={faFilm} className={cx('files-icon')} />
          </Avatar>
          <Avatar sx={{ width: 40, height: 40 }}>
            <FontAwesomeIcon icon={faFile} className={cx('avatar-icon')} />
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default ClosedRightbarInner;
