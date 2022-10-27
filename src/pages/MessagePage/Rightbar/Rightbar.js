import { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import { ButtonBase, IconButton } from '@mui/material';
import classNames from 'classnames/bind';

import styles from './Rightbar.module.scss';
import RoomInfo from './RoomInfo';
import Members from './Members';
import ChatFiles from './ChatFiles';
import ClosedRightbarInner from './ClosedRightbarInner';
import { AppContext } from '~/Context/AppProvider';

const cx = classNames.bind(styles);
function Rightbar() {
  const { selectedRoomId } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleRightBar = () => {
    setIsOpen((prev) => !prev);
  };
  if (selectedRoomId === '') return
  return (
    <div className={cx('container', isOpen ? '' : 'close')}>
      {isOpen ? (
        <>
          <header className={cx('header')}>
            <IconButton className={cx('toggle-btn')} onClick={handleToggleRightBar}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </IconButton>
            <p>Chat details</p>
          </header>
          <RoomInfo />
          <div className={cx('actions')}>
            <ButtonBase className={cx('call-btn', 'voice-chat')}>
              <FontAwesomeIcon icon={faPhone} className={cx('call-icon')} />
              <span>Voice chat</span>
            </ButtonBase>
            <ButtonBase className={cx('call-btn', 'video-call')}>
              <FontAwesomeIcon icon={faVideo} className={cx('call-icon')} />
              <span>Video call</span>
            </ButtonBase>
          </div>
          <Members />
          <ChatFiles />
        </>
      ) : (
        <ClosedRightbarInner handleToggleRightBar={handleToggleRightBar}/>
      )}
    </div>
  );
}

export default Rightbar;
