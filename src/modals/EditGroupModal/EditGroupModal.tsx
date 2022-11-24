import { TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import classNames from 'classnames/bind';

import styles from './EditGroupModal.module.scss';
import { db } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';
import ModalContainer from '../../components/ModalContainer';

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
    <ModalContainer
     open={isOpenEditGroup}
     title='Edit Group'
     color='primary'
     formName='editgroup-form'
     actionBtnName='Edit'
     handleClose={handleCloseModal}
     handleAction={handleSubmit(handleEditGroup)}>
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
      </Box>
    </ModalContainer>
  );
}

export default EditGroupModal;
