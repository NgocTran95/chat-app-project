import { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import { ButtonBase } from '@mui/material';
import classNames from 'classnames/bind';

import styles from './Rightbar.module.scss';
import GroupInfo from './GroupInfo';
import Members from './Members';
import ChatFiles from './ChatFiles';
import ClosedRightbarInner from './ClosedRightbarInner';
import { AppContext } from '~/Context/AppProvider';

const cx = classNames.bind(styles);
function Rightbar() {
  const { selectedGroupId, setToastMessage, toastMessage } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);


  const sendMessage = () => {
    setToastMessage({ ...toastMessage, open: true, message: 'This feature will be updated soon', severity: 'error' });
  }
  const handleToggleRightBar = () => {
    setIsOpen((prev) => !prev);
  };
  if (selectedGroupId === '') return;
  return (
    <div className={cx('container', isOpen ? '' : 'close')}>
      {isOpen ? (
        <>
          <header className={cx('header')}>
            <ButtonBase className={cx('toggle-btn')} onClick={handleToggleRightBar}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </ButtonBase>
            <p>Chat details</p>
          </header>
          <GroupInfo />
          <div className={cx('actions')}>
            <ButtonBase className={cx('call-btn', 'voice-chat')} onClick={sendMessage}>
              <FontAwesomeIcon icon={faPhone} className={cx('call-icon')} />
              <span>Voice chat</span>
            </ButtonBase>
            <ButtonBase className={cx('call-btn', 'video-call')} onClick={sendMessage}>
              <FontAwesomeIcon icon={faVideo} className={cx('call-icon')} />
              <span>Video call</span>
            </ButtonBase>
          </div>
          <Members />
          <ChatFiles />
        </>
      ) : (
        <ClosedRightbarInner handleToggleRightBar={handleToggleRightBar} />
      )}
    </div>
  );
}

export default Rightbar;
