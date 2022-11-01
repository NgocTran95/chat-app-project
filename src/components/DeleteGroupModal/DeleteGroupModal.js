import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Fade, Modal, Backdrop, IconButton, ButtonBase } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';

import { AppContext } from '~/Context/AppProvider';
import classNames from 'classnames/bind';
import styles from './DeleteGroupModal.module.scss';
import { db } from '~/firebase/config';
import { doc, deleteDoc } from 'firebase/firestore';

const cx = classNames.bind(styles);
function DeleteGroupModal() {
  const { isOpenDeleteGroup, setIsOpenDeleteGroup, selectedGroupId, setSelectedGroupId } = useContext(AppContext);

  const handleDeleteGroup = () => {
    deleteDoc(doc(db, 'groups', selectedGroupId))
    setSelectedGroupId('')
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
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
          </header>
          <p className={cx('content')}>Are you sure to delete this group?</p>
          <div className={cx('btn-groups')}>
            <ButtonBase variant="outlined" className={cx('btn')} onClick={handleCloseModal}>
              Cancel
            </ButtonBase>
            <ButtonBase variant="contained" type='submit' className={cx('btn', 'delete-btn')} onClick={handleDeleteGroup}>
              Delete
            </ButtonBase>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default DeleteGroupModal;
