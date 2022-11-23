import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fade, Modal, Backdrop, IconButton, TextField, Autocomplete, Avatar, Chip, Button } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';

import classNames from 'classnames/bind';
import styles from './InviteMemberModal.module.scss';
import { useForm } from 'react-hook-form';
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';
import { closeIcon } from '../AddGroupModal/AddGroupModal';

const cx = classNames.bind(styles);

type optionValues = {
  title: string;
  photoURL: string;
  value: string;
};
type debouncePropsType = {
  fetchOptions: (search: string, curMembers: string[]) => Promise<optionValues[]>;
  debounceTimeout: number;
  curMembers: string[];
  onChange: ((event: React.SyntheticEvent<Element, Event>, value: optionValues[]) => void) | undefined;
};

// React Customized Debounce AutoComplete Component
function DebounceAutocomplete({ fetchOptions, debounceTimeout = 300, curMembers, onChange }: debouncePropsType) {
  const [fetching, setFetching] = useState<boolean>(false);
  const [options, setOptions] = useState<optionValues[]>([]);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
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
      onChange={onChange}
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

async function fetchUserList(search: string, curMembers: string[]) {
  const q = query(
    collection(db, 'users'),
    where('keywords', 'array-contains', search?.toLowerCase()),
    orderBy('displayName'),
    limit(20),
  );
  const querySnapshot = await getDocs(q);
  const options: optionValues[] = querySnapshot.docs
    .map((doc) => ({
      title: doc.data().displayName,
      photoURL: doc.data().photoURL,
      value: doc.data().uid,
    }))
    .filter((option) => !curMembers.includes(option.value));
  return options;
}

//  React Component InviteMemberModal

function InviteMemberModal() {
  const { isOpenInviteMember, setIsOpenInviteMember, selectedGroup, selectedGroupId, emailUserDisplayName } =
    useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [options, setOptions] = useState<optionValues[]>([]);
  const { handleSubmit } = useForm();

  const handleInviteMember = () => {
    if (options.length === 0) {
      setIsOpenInviteMember(false);
      return;
    }
    const groupRef = doc(db, 'groups', selectedGroupId);
    // Invite member
    updateDoc(groupRef, { members: [...selectedGroup.members, ...options.map((option) => option.value)] }).then(() => {
      addDoc(collection(db, 'messages'), {
        type: 'notification',
        text: `${user.displayName || emailUserDisplayName} has invited ${options.reduce(
          (people, option) => (people += `${option.title} `),
          '',
        )}to this group`,
        displayName: user.displayName || emailUserDisplayName,
        groupId: selectedGroupId,
        createAt: serverTimestamp(),
      });
    });
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
              <FontAwesomeIcon icon={closeIcon} />
            </IconButton>
          </header>
          <Box component="form" className={cx('form')} onSubmit={handleSubmit(handleInviteMember)}>
            <DebounceAutocomplete
              fetchOptions={fetchUserList}
              onChange={(event: React.SyntheticEvent<Element, Event>, value: optionValues[]) => setOptions(value)}
              curMembers={selectedGroup.members}
              debounceTimeout={300}
            />
            <div className={cx('btn-groups')}>
              <Button variant="outlined" className={cx('btn')} onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="contained" className={cx('btn', 'add-btn')} onClick={handleSubmit(handleInviteMember)}>
                Invite
              </Button>
            </div>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default InviteMemberModal;
