import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import {ButtonBase, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './Rightbar.module.scss';
import RoomInfo from './RoomInfo';

const cx = classNames.bind(styles);
function Rightbar() {
  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <IconButton className={cx('toggle-btn')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </IconButton>
        <p>Chat details</p>
      </header>
      <RoomInfo />
      <div className={cx('actions')}>
        <ButtonBase className={cx('call-btn', 'voice-chat')}>
          <FontAwesomeIcon icon={faPhone} className={cx('call-icon')}/>
          Voice chat
        </ButtonBase>
        <ButtonBase className={cx('call-btn', 'video-call')}>
          <FontAwesomeIcon icon={faVideo} className={cx('call-icon')}/>
          Video call
        </ButtonBase>
      </div>
    </div>
  );
}

export default Rightbar;
