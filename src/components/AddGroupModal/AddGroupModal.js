import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Fade, Modal, Backdrop, IconButton, ButtonBase, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';

import classNames from 'classnames/bind';
import styles from './AddGroupModal.module.scss';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '~/firebase/config';
import { AuthContext } from '~/Context/AuthProvider';
import { AppContext } from '~/Context/AppProvider';
import { addNotifications } from '~/firebase/services';

const cx = classNames.bind(styles);
function AddGroupModal() {
  const { isOpenAddGroup, setIsOpenAddGroup } = useContext(AppContext);
  const { uid, displayName } = useContext(AuthContext);
  const { emailUserDisplayName } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddGroup = (data) => {
    // Create Group
    addDoc(collection(db, 'groups'), {
      name: data.groupName,
      description: data.groupDesc,
      avatarURL: data.groupAvatar,
      members: [uid],
      createAt: serverTimestamp(),
      admins: [uid],
    });
    reset({
      groupName: '',
      groupDesc: '',
      groupAvatar: '',
    });
    setIsOpenAddGroup(false);

    // Add notification
    addNotifications(uid, `${displayName || emailUserDisplayName} has created this group`, `${displayName || emailUserDisplayName}`)
  };

  const handleCloseModal = () => {
    reset({
      errors: false,
    });
    setIsOpenAddGroup(false);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpenAddGroup}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpenAddGroup}>
        <Box className={cx('container')}>
          <header className={cx('header')}>
            <h4>Create Group</h4>
            <IconButton className={cx('close-btn')} onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
          </header>
          <Box component="form" className={cx('form')} id="addgroup-form" onSubmit={handleSubmit(handleAddGroup)}>
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
                form="addgroup-form"
                className={cx('btn', 'add-btn')}
                onClick={handleSubmit(handleAddGroup)}
              >
                Create
              </ButtonBase>
            </div>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default AddGroupModal;
