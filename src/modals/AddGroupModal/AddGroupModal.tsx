import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames/bind';

import styles from './AddGroupModal.module.scss';
import { addDoc, collection, serverTimestamp, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';
import ModalContainer from '../../components/ModalContainer';

type FormValues = {
  groupName: string;
  groupDesc: string;
  groupAvatar: string;
};

export const closeIcon = faClose as IconProp;

const cx = classNames.bind(styles);
function AddGroupModal() {
  const { isOpenAddGroup, setIsOpenAddGroup, setSelectedGroupId, emailUserDisplayName } = useContext(AppContext);
  const {
    user: { uid, displayName },
  } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const handleAddGroup: SubmitHandler<FormValues> = (data) => {
    // Create Group
    addDoc(collection(db, 'groups'), {
      name: data.groupName,
      description: data.groupDesc,
      avatarURL: data.groupAvatar,
      members: [uid],
      createAt: serverTimestamp(),
      admins: [uid],
    }).then(() => {
      const getGroups = async (uid: string) => {
        const q = query(collection(db, 'groups'), where('members', 'array-contains', uid), orderBy('createAt', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
        }));
      };
      getGroups(uid).then((groupIds) => {
        addDoc(collection(db, 'messages'), {
          type: 'notification',
          text: `${displayName || emailUserDisplayName} has created this group`,
          displayName: displayName || emailUserDisplayName,
          groupId: groupIds[groupIds.length - 1].id,
          createAt: serverTimestamp(),
        });
        setSelectedGroupId(groupIds[groupIds.length - 1].id);
      });
    });
    reset({
      groupName: '',
      groupDesc: '',
      groupAvatar: '',
    });
    setIsOpenAddGroup(false);
  };

  const handleCloseModal = () => {
    reset({
      groupName: '',
      groupDesc: '',
      groupAvatar: '',
    });
    setIsOpenAddGroup(false);
  };

  return (
    <ModalContainer
      open={isOpenAddGroup}
      title="Create Group"
      color="primary"
      formName="addgroup-form"
      actionBtnName='Create'
      handleClose={handleCloseModal}
      handleAction={handleSubmit(handleAddGroup)}
    >
      <Box component="form" className={cx('form')} id="addgroup-form" onSubmit={handleSubmit(handleAddGroup)}>
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

export default AddGroupModal;
