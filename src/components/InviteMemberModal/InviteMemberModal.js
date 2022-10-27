import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Fade, Modal, Backdrop, IconButton, ButtonBase, TextField, Autocomplete, Avatar, Chip } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';

import classNames from 'classnames/bind';
import styles from './InviteMemberModal.module.scss';
import { AppContext } from '~/Context/AppProvider';
import { useForm } from 'react-hook-form';
import { collection, doc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '~/firebase/config';

const cx = classNames.bind(styles);

// React Customized Debounce AutoComplete Component
function DebounceAutocomplete({ fetchOptions, debounceTimeout = 300, curMembers, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, curMembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions, curMembers]);
  useEffect(() => {
    return () => {
      setOptions([]);
    };
  }, []);

  return (
    <Autocomplete
      multiple
      id="tags-outlined"
      loading={fetching}
      options={options}
      filterSelectedOptions
      {...props}
      getOptionLabel={(option) => option.title}
      renderOption={(props, option) => {
        return (
          <Box component="li" {...props} sx={{ '& > div': { mr: 1 }, fontSize: 14 }}>
            <Avatar src={option.photoURL} sx={{ width: 44, height: 44 }} />
            {option.title}
          </Box>
        );
      }}
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => <Chip label={option.title} {...getTagProps({ index })} />);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Invite Friends"
          placeholder="Select to invite friends"
          className={cx('input')}
          onChange={(e) => {
            debounceFetcher(e.target.value);
          }}
        />
      )}
    />
  );
}

// Hàm fetch users từ collection users match với search value

async function fetchUserList(search, curMembers) {
  const q = query(
    collection(db, 'users'),
    where('keywords', 'array-contains', search?.toLowerCase()),
    orderBy('displayName'),
    limit(20),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({
      title: doc.data().displayName,
      photoURL: doc.data().photoURL,
      value: doc.data().uid,
    }))
    .filter((option) => !curMembers.includes(option.value));
}

//  React Component InviteMemberModal

function InviteMemberModal() {
  const { isOpenInviteMember, setIsOpenInviteMember, selectedRoom, selectedRoomId } = useContext(AppContext);
  const [options, setOptions] = useState([]);
  const { handleSubmit } = useForm();

  const handleInviteMember = () => {
    const roomRef = doc(collection(db, 'rooms'), `${selectedRoomId}`);
    updateDoc(roomRef, {members: [...selectedRoom.members, ...options.map((option) => option.value)]});
    setIsOpenInviteMember(false);
    setOptions([]);
  };

  const handleCloseModal = () => {
    setIsOpenInviteMember(false);
    setOptions([]);
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpenInviteMember}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpenInviteMember}>
        <Box className={cx('container')}>
          <header className={cx('header')}>
            <h4>Invite more friends</h4>
            <IconButton className={cx('close-btn')} onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
          </header>
          <Box component="form" className={cx('form')} onSubmit={handleSubmit(handleInviteMember)}>
            <DebounceAutocomplete
              fetchOptions={fetchUserList}
              onChange={(event, value) => setOptions(value)}
              curMembers={selectedRoom.members}
            />
            <div className={cx('btn-groups')}>
              <ButtonBase variant="outlined" className={cx('btn')} onClick={handleCloseModal}>
                Cancel
              </ButtonBase>
              <ButtonBase
                variant="contained"
                className={cx('btn', 'add-btn')}
                onClick={handleSubmit(handleInviteMember)}
              >
                Invite
              </ButtonBase>
            </div>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default InviteMemberModal;
