import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fade, Modal, Backdrop, IconButton, Button } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import classNames from 'classnames/bind';

import styles from './RemoveMemberModal.module.scss';
import { db } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';
import { closeIcon } from '../AddGroupModal/AddGroupModal';

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
  const { user } = useContext(AuthContext);
  const handleRemoveMember = () => {
    const groupRef = doc(db, 'groups', selectedGroupId);
    // Remove member
    updateDoc(groupRef, {
      members: selectedGroup.members.filter((memberUid) => memberUid !== removeMember.uid),
    }).then(() => {
      addDoc(collection(db, 'messages'), {
        type: 'notification',
        text: `${user.displayName || emailUserDisplayName} has removed ${removeMember.displayName} from this group`,
        displayName: user.displayName || emailUserDisplayName,
        groupId: selectedGroupId,
        createAt: serverTimestamp(),
      });
    });
    setRemoveMember({displayName: '', uid: ''});
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
              <FontAwesomeIcon icon={closeIcon} />
            </IconButton>
          </header>
          <p className={cx('content')}>
            Are you sure to remove <span className={cx('remove-member')}>{removeMember?.displayName}</span> ?
          </p>
          <div className={cx('btn-groups')}>
            <Button variant="outlined" className={cx('btn')} onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              className={cx('btn', 'remove-btn')}
              onClick={handleRemoveMember}
            >
              Remove
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default RemoveMemberModal;
