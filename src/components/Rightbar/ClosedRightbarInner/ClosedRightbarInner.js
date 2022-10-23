import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPhone, faVideo, faFileLines, faFileImage, faFilm, faFile } from '@fortawesome/free-solid-svg-icons';
import { ButtonBase, IconButton, Avatar } from '@mui/material';

import styles from './ClosedRightbarInner.module.scss';
import ProfileAvatar from '~/components/ProfileAvatar';
import { members } from '~/MockData/data';
const cx = classNames.bind(styles);
function ClosedRightbarInner({ handleToggleRightBar }) {
  return (
    <div className={cx('inner')}>
      <header className={cx('header')}>
        <IconButton className={cx('toggle-btn')} onClick={()=> handleToggleRightBar()}>
          <FontAwesomeIcon icon={faArrowRight} />
        </IconButton>
      </header>
      <div className={cx('avatar')}>
        <Avatar
          src="https://theimportantsite.com/wp-content/uploads/2020/04/family-1466262_1280-2.jpg"
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
          {members
            .filter((member) => member.isUser === false)
            .map((member) => {
              const { id, name, image, status } = member;
              return <ProfileAvatar key={id} name={name} image={image} status={status} width={40} height={40} />;
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
