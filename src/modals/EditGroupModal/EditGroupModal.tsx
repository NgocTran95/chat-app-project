import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fade, Modal, Backdrop, IconButton, TextField, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import classNames from 'classnames/bind';

import styles from './EditGroupModal.module.scss';
import { db } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';
import { closeIcon } from '../AddGroupModal/AddGroupModal';

type FormValues = {
  groupName: string;
  groupDesc: string;
  groupAvatar: string;
};

const cx = classNames.bind(styles);
function EditGroupModal() {
  const { isOpenEditGroup, setIsOpenEditGroup, selectedGroupId, emailUserDisplayName } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const handleEditGroup: SubmitHandler<FormValues> = (data) => {
    const groupRef = doc(db, 'groups', selectedGroupId);
    updateDoc(groupRef, {
      name: data.groupName,
      description: data.groupDesc,
      avatarURL: data.groupAvatar,
    }).then(() => {
      addDoc(collection(db, 'messages'), {
        type: 'notification',
        text: `${user.displayName || emailUserDisplayName} has updated this group information`,
        displayName: user.displayName || emailUserDisplayName,
        groupId: selectedGroupId,
        createAt: serverTimestamp(),
      });
    });
    reset({
      groupName: '',
      groupDesc: '',
      groupAvatar: '',
    });
    setIsOpenEditGroup(false);
  };
  const handleCloseModal = () => {
    reset({
      groupName: '',
      groupDesc: '',
      groupAvatar: '',
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
              <FontAwesomeIcon icon={closeIcon} />
            </IconButton>
          </header>
          <Box component="form" className={cx('form')} id="editgroup-form" onSubmit={handleSubmit(handleEditGroup)}>
            <TextField
              required
              variant="standard"
              id="groupName"
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
              label="Description (Optional)"
              fullWidth
              margin="dense"
              {...register('groupDesc')}
            />
            <TextField
              variant="standard"
              id="groupAvatar"
              label="Avatar URL (Optional)"
              fullWidth
              margin="dense"
              {...register('groupAvatar')}
            />
            <div className={cx('btn-groups')}>
              <Button variant="outlined" className={cx('btn')} onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                form="editgroup-form"
                className={cx('btn', 'edit-btn')}
                onClick={handleSubmit(handleEditGroup)}
              >
                Edit
              </Button>
            </div>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default EditGroupModal;
