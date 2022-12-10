import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ButtonBase, Avatar, Tooltip, Zoom } from '@mui/material';
import { useContext } from 'react';

import styles from './ClosedRightbarInner.module.scss';
import ProfileAvatar from '../../../../components/ProfileAvatar';
import { AppContext } from '../../../../Context/AppProvider';
import { AuthContext } from '../../../../Context/AuthProvider';
import { formatFileSize } from '../../../../utilities';
import { phoneIcon, videoIcon } from '../Rightbar';
import { fileLinesIcon, fileImageIcon, filmIcon } from '../ChatFiles/ChatFiles';

const cx = classNames.bind(styles);

const arrowRightIcon = faArrowRight as IconProp;

type Props = {
  handleToggleRightBar: () => void;
};
function ClosedRightbarInner({ handleToggleRightBar }: Props) {
  const { modifiedMembers, toastMessage, setToastMessage, selectedGroup, totalDocuments, totalImages, totalVideos } =
    useContext(AppContext);
  const { user } = useContext(AuthContext);
  const sendMessage = () => {
    setToastMessage({ ...toastMessage, open: true, message: 'This feature will be updated soon', severity: 'error' });
  };
  return (
    <div className={cx('inner')}>
      <header className={cx('header')}>
        <ButtonBase className={cx('toggle-btn')} onClick={() => handleToggleRightBar()}>
          <FontAwesomeIcon icon={arrowRightIcon} />
        </ButtonBase>
      </header>
      <div className={cx('avatar')}>
        <Avatar src={selectedGroup.avatarURL} sx={{ width: 40, height: 40 }} alt="avatar" />
      </div>
      <div className={cx('actions')}>
        <ButtonBase className={cx('call-btn', 'voice-chat')} onClick={sendMessage}>
          <FontAwesomeIcon icon={phoneIcon} className={cx('call-icon')} />
        </ButtonBase>
        <ButtonBase className={cx('call-btn', 'video-call')} onClick={sendMessage}>
          <FontAwesomeIcon icon={videoIcon} className={cx('call-icon')} />
        </ButtonBase>
      </div>
      <div className={cx('members')}>
        <header className={cx('members-header')}>
          <h5 className={cx('members-title')}>People</h5>
        </header>
        <div className={cx('member-list')}>
          {modifiedMembers
            .filter((member) => member.uid !== user.uid)
            .map((member) => {
              const { uid, displayName, photoURL, status } = member;
              return (
                <ProfileAvatar
                  key={uid}
                  name={displayName}
                  image={photoURL}
                  status={status.state}
                  width={40}
                  height={40}
                />
              );
            })}
        </div>
      </div>
      <div className={cx('files')}>
        <header className={cx('files-header')}>
          <h5 className={cx('files-title')}>Files</h5>
        </header>
        <div className={cx('files-icons')}>
          <Tooltip
            title={`Total: ${totalDocuments.totalNum} files - ${formatFileSize(totalDocuments.totalSize)}`}
            TransitionComponent={Zoom}
            PopperProps={{ sx: { '& .MuiTooltip-tooltip': { fontSize: 10 } } }}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              <FontAwesomeIcon icon={fileLinesIcon} className={cx('files-icon')} />
            </Avatar>
          </Tooltip>
          <Tooltip
            title={`Total: ${totalImages.totalNum} files - ${formatFileSize(totalImages.totalSize)}`}
            TransitionComponent={Zoom}
            PopperProps={{ sx: { '& .MuiTooltip-tooltip': { fontSize: 10 } } }}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              <FontAwesomeIcon icon={fileImageIcon} className={cx('files-icon')} />
            </Avatar>
          </Tooltip>
          <Tooltip
            title={`Total: ${totalVideos.totalNum} files - ${formatFileSize(totalVideos.totalSize)}`}
            TransitionComponent={Zoom}
            PopperProps={{ sx: { '& .MuiTooltip-tooltip': { fontSize: 10 } } }}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              <FontAwesomeIcon icon={filmIcon} className={cx('files-icon')} />
            </Avatar>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default ClosedRightbarInner;
