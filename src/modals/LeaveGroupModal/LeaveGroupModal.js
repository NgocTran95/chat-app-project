import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Fade, Modal, Backdrop, IconButton, ButtonBase } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';

import { AppContext } from '~/Context/AppProvider';
import classNames from 'classnames/bind';
import styles from './LeaveGroupModal.module.scss';
import { db } from '~/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '~/Context/AuthProvider';
import { addNotifications } from '~/firebase/services';

const cx = classNames.bind(styles);
function LeaveGroupModal() {
  const {
    isOpenLeaveGroup,
    setIsOpenLeaveGroup,
    isAdmin,
    selectedGroupId,
    selectedGroup,
    setSelectedGroupId,
    emailUserDisplayName,
  } = useContext(AppContext);
  const { uid, displayName } = useContext(AuthContext);

  const handleLeaveGroup = () => {
    // Asynchronous action -  add notification before leave
    addNotifications(uid, `${displayName || emailUserDisplayName} has leaved this group`, `${displayName || emailUserDisplayName}`).then(() => {
      // Handle leave
      const groupRef = doc(db, 'groups', selectedGroupId);
      updateDoc(groupRef, {
        members: selectedGroup.members.filter((memberUid) => memberUid !== uid),
      });
      // If isAdmin that remove from admin array
      if (isAdmin) {
        if (selectedGroup.admins.length === 1) {
          updateDoc(groupRef, {
            admins: selectedGroup.members.filter((memberUid) => memberUid !== uid),
          });
        } else {
          updateDoc(groupRef, {
            admins: selectedGroup.admins.filter((memberUid) => memberUid !== uid),
          });
        }
      }
    })
    setIsOpenLeaveGroup(false);
    setSelectedGroupId('');
  };

  const handleCloseModal = () => {
    setIsOpenLeaveGroup(false);
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpenLeaveGroup}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpenLeaveGroup}>
        <Box className={cx('container')}>
          <header className={cx('header')}>
            <h4>Leave Group</h4>
            <IconButton className={cx('close-btn')} onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
          </header>
          <p className={cx('content')}>Are you sure to leave this group?</p>
          <div className={cx('btn-groups')}>
            <ButtonBase variant="outlined" className={cx('btn')} onClick={handleCloseModal}>
              Cancel
            </ButtonBase>
            <ButtonBase variant="contained" type="submit" className={cx('btn', 'leave-btn')} onClick={handleLeaveGroup}>
              Leave
            </ButtonBase>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default LeaveGroupModal;
