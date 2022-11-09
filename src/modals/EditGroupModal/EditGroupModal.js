import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Fade, Modal, Backdrop, IconButton, ButtonBase, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';

import { AppContext } from '~/Context/AppProvider';
import classNames from 'classnames/bind';
import styles from './EditGroupModal.module.scss';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase/config';
import { addNotifications } from '~/firebase/services';
import { AuthContext } from '~/Context/AuthProvider';

const cx = classNames.bind(styles);
function EditGroupModal() {
  const { isOpenEditGroup, setIsOpenEditGroup, selectedGroupId, emailUserDisplayName } = useContext(AppContext);
  const { uid, displayName } = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleEditGroup = (data) => {
    const groupRef = doc(db, 'groups', selectedGroupId);
    updateDoc(groupRef, {
      name: data.groupName,
      description: data.groupDesc,
      avatarURL: data.groupAvatar,
    });
    addNotifications(
      uid,
      `${displayName || emailUserDisplayName} has updated this group information`,
      `${displayName || emailUserDisplayName}`
    );
    reset({
      groupName: '',
      groupDesc: '',
      groupAvatar: '',
    });
    setIsOpenEditGroup(false);
  };
  const handleCloseModal = () => {
    reset({
      errors: false,
    });
    setIsOpenEditGroup(false);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpenEditGroup}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpenEditGroup}>
        <Box className={cx('container')}>
          <header className={cx('header')}>
            <h4>Edit Group</h4>
            <IconButton className={cx('close-btn')} onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
          </header>
          <Box component="form" className={cx('form')} id="editgroup-form" onSubmit={handleSubmit(handleEditGroup)}>
            <TextField
              required
              variant="standard"
              id="groupName"
              name="groupName"
              label="Group Name"
              fullWidth
              margin="dense"
              {...register('groupName', { required: true })}
              error={errors.groupName?.type === 'required'}
              className={cx('input')}
            />
            {errors.groupName?.type === 'required' && (
              <Typography color="red" role="alert">
                First name is required
              </Typography>
            )}
            <TextField
              variant="standard"
              id="groupDesc"
              name="groupDesc"
              label="Description (Optional)"
              fullWidth
              margin="dense"
              {...register('groupDesc')}
            />
            <TextField
              variant="standard"
              id="groupAvatar"
              name="groupAvatar"
              label="Avatar URL (Optional)"
              fullWidth
              margin="dense"
              {...register('groupAvatar')}
            />
            <div className={cx('btn-groups')}>
              <ButtonBase variant="outlined" className={cx('btn')} onClick={handleCloseModal}>
                Cancel
              </ButtonBase>
              <ButtonBase
                variant="contained"
                type="submit"
                form="editgroup-form"
                className={cx('btn', 'edit-btn')}
                onClick={handleSubmit(handleEditGroup)}
              >
                Edit
              </ButtonBase>
            </div>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default EditGroupModal;
