import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fade, Modal, Backdrop, IconButton, ButtonBase, Button } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';

import { AppContext } from '../../Context/AppProvider';
import classNames from 'classnames/bind';
import styles from './DeleteGroupModal.module.scss';
import { db } from '../../firebase/config';
import { closeIcon } from '../AddGroupModal/AddGroupModal';

const cx = classNames.bind(styles);
function DeleteGroupModal() {
  const { isOpenDeleteGroup, setIsOpenDeleteGroup, selectedGroupId, setSelectedGroupId, messages } =
    useContext(AppContext);
  const handleDeleteGroup = () => {
    // Delete group
    deleteDoc(doc(db, 'groups', selectedGroupId));
    // Delete all messages in group
    messages.forEach((message) => {
      deleteDoc(doc(db, 'messages', message.id));
    });
    setSelectedGroupId('');
    setIsOpenDeleteGroup(false);
  };

  const handleCloseModal = () => {
    setIsOpenDeleteGroup(false);
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpenDeleteGroup}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpenDeleteGroup}>
        <Box className={cx('container')}>
          <header className={cx('header')}>
            <h4>Delete Group</h4>
            <IconButton className={cx('close-btn')} onClick={handleCloseModal}>
              <FontAwesomeIcon icon={closeIcon} />
            </IconButton>
          </header>
          <p className={cx('content')}>Are you sure to delete this group?</p>
          <div className={cx('btn-groups')}>
            <button className={cx('btn')} onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              type="submit"
              className={cx('btn', 'delete-btn')}
              onClick={handleDeleteGroup}
            >
              Delete
            </button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default DeleteGroupModal;
