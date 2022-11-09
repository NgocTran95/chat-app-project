import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Fade, Modal, Backdrop, IconButton, ButtonBase } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';

import { AppContext } from '~/Context/AppProvider';
import classNames from 'classnames/bind';
import styles from './RemoveMemberModal.module.scss';
import { db } from '~/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '~/Context/AuthProvider';
import { addNotifications } from '~/firebase/services';

const cx = classNames.bind(styles);
function RemoveMemberModal() {
  const {
    isOpenRemoveMember,
    setIsOpenRemoveMember,
    removeMember,
    setRemoveMember,
    selectedGroup,
    selectedGroupId,
    emailUserDisplayName,
  } = useContext(AppContext);
  const { uid, displayName } = useContext(AuthContext);
  const handleRemoveMember = () => {
    const groupRef = doc(db, 'groups', selectedGroupId);
    // Remove member
    updateDoc(groupRef, {
      members: selectedGroup.members.filter((memberUid) => memberUid !== removeMember.uid),
    });

    // Add notification
    addNotifications(uid, `${displayName || emailUserDisplayName} has removed ${removeMember.displayName} from this group`, `${displayName || emailUserDisplayName}`)
    
    setRemoveMember(null);
    setIsOpenRemoveMember(false);
  };

  const handleCloseModal = () => {
    setIsOpenRemoveMember(false);
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpenRemoveMember}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpenRemoveMember}>
        <Box className={cx('container')}>
          <header className={cx('header')}>
            <h4>Remove member</h4>
            <IconButton className={cx('close-btn')} onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
          </header>
          <p className={cx('content')}>
            Are you sure to remove <span className={cx('remove-member')}>{removeMember?.displayName}</span> ?
          </p>
          <div className={cx('btn-groups')}>
            <ButtonBase variant="outlined" className={cx('btn')} onClick={handleCloseModal}>
              Cancel
            </ButtonBase>
            <ButtonBase
              variant="contained"
              type="submit"
              className={cx('btn', 'remove-btn')}
              onClick={handleRemoveMember}
            >
              Remove
            </ButtonBase>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default RemoveMemberModal;
