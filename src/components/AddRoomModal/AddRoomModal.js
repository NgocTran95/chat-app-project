import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Fade, Modal, Backdrop, IconButton, ButtonBase, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';

import { AppContext } from '~/Context/AppProvider';
import classNames from 'classnames/bind';
import styles from './AddRoomModal.module.scss';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '~/firebase/config';
import { AuthContext } from '~/Context/AuthProvider';

const cx = classNames.bind(styles);
function AddRoomModal() {
  const { isOpenAddRoom, setIsOpenAddRoom } = useContext(AppContext);
  const { uid } = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddRoom = (data) => {
    addDoc(collection(db, 'rooms'), {
      name: data.roomName,
      description: data.roomDesc,
      members: [uid],
      createAt: serverTimestamp()
    })
    reset({
      roomName: '',
      roomDesc: '',
    });
    setIsOpenAddRoom(false);
  };
  const handleCloseModal = () => {
    reset({
      errors: false,
    });
    setIsOpenAddRoom(false);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpenAddRoom}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpenAddRoom}>
        <Box className={cx('container')}>
          <header className={cx('header')}>
            <h4>Add Room</h4>
            <IconButton className={cx('close-btn')} onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
          </header>
          <Box component="form" className={cx('form')} onSubmit={handleSubmit(handleAddRoom)}>
            <TextField
              required
              variant="standard"
              id="roomName"
              name="roomName"
              label="Room Name"
              fullWidth
              margin="dense"
              {...register('roomName', { required: true })}
              error={errors.roomName?.type === 'required'}
              className={cx('input')}
            />
            {errors.roomName?.type === 'required' && (
              <Typography color="red" role="alert">
                First name is required
              </Typography>
            )}
            <TextField
              variant="standard"
              id="roomDesc"
              name="roomDesc"
              label="Description"
              fullWidth
              margin="dense"
              {...register('roomDesc')}
            />
            <div className={cx('btn-groups')}>
              <ButtonBase variant="outlined" className={cx('btn')} onClick={handleCloseModal}>
                Cancel
              </ButtonBase>
              <ButtonBase variant="contained" className={cx('btn', 'add-btn')} onClick={handleSubmit(handleAddRoom)}>
                Add
              </ButtonBase>
            </div>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default AddRoomModal;
