import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Fade, Modal, Backdrop, IconButton, ButtonBase } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';

import { AppContext } from '~/Context/AppProvider';
import classNames from 'classnames/bind';
import styles from './LogoutModal.module.scss';
import { auth, db } from '~/firebase/config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const cx = classNames.bind(styles);
function LogoutModal() {
  const { isOpenLogOut, setIsOpenLogOut, setSelectedGroupId, userId, setUserId } = useContext(AppContext);

  const handleLogout = () => {
    // Set offline status when logout
    updateDoc(doc(db, 'users', userId), { status: { state: 'Offline', last_changed: serverTimestamp() } }).then(() => {
      // Logout
      auth.signOut();
      setSelectedGroupId('');
      setUserId('')
      setIsOpenLogOut(false);
    });
  };

  const handleCloseModal = () => {
    setIsOpenLogOut(false);
  };
  return (
    <Modal
      open={isOpenLogOut}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpenLogOut}>
        <Box className={cx('container')}>
          <header className={cx('header')}>
            <h4>Log out</h4>
            <IconButton className={cx('close-btn')} onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
          </header>
          <p className={cx('content')}>Are you sure to log out?</p>
          <div className={cx('btn-groups')}>
            <ButtonBase variant="outlined" className={cx('btn')} onClick={handleCloseModal}>
              Cancel
            </ButtonBase>
            <ButtonBase variant="contained" type="submit" className={cx('btn', 'logout-btn')} onClick={handleLogout}>
              Log Out
            </ButtonBase>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default LogoutModal;
