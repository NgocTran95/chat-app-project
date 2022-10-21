import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import { ButtonBase, IconButton } from '@mui/material';
import classNames from 'classnames/bind';

import styles from './Rightbar.module.scss';
import RoomInfo from './RoomInfo';
import Members from './Members';
import ChatFiles from './ChatFiles';

const cx = classNames.bind(styles);
function Rightbar() {
  const [isOpen, setIsOpen] = useState(true);
  const handleToggleRightBar = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className={cx('container', isOpen ? '': 'close')}>
      <header className={cx('header')}>
        <IconButton className={cx('toggle-btn')} onClick={handleToggleRightBar}>
          <FontAwesomeIcon icon={isOpen ? faArrowLeft : faArrowRight} />
        </IconButton>
        {isOpen && <p>Chat details</p>}
      </header>
      <RoomInfo isOpen={isOpen}/>
      <div className={cx('actions')}>
        <ButtonBase className={cx('call-btn', 'voice-chat',  isOpen ? '' : 'close')}>
          <FontAwesomeIcon icon={faPhone} className={cx('call-icon')} />
          {isOpen && <span>Voice chat</span> }
        </ButtonBase>
        <ButtonBase className={cx('call-btn', 'video-call',  isOpen ? '' : 'close')}>
          <FontAwesomeIcon icon={faVideo} className={cx('call-icon')} />
          {isOpen && <span>Video call</span> }
        </ButtonBase>
      </div>
      <Members isOpen={isOpen}/>
      <ChatFiles isOpen={isOpen}/>
    </div>
  );
}

export default Rightbar;
