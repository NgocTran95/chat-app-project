import { useContext } from 'react';
import classNames from 'classnames/bind';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

import styles from './LeaveGroupModal.module.scss';
import { db } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';
import ModalContainer from '../../components/ModalContainer';

const cx = classNames.bind(styles);
function LeaveGroupModal() {
  const {
    isOpenLeaveGroup,
    setIsOpenLeaveGroup,
    isAdmin,
    selectedGroupId,
    selectedGroup,
    setSelectedGroupId,
    emailUserDisplayName,
  } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const { uid, displayName } = user;

  const handleLeaveGroup = () => {
    // Asynchronous action -  add notification before leave
    addDoc(collection(db, 'messages'), {
      type: 'notification',
      text: `${displayName || emailUserDisplayName} has leaved this group`,
      displayName: displayName || emailUserDisplayName,
      groupId: selectedGroupId,
      createAt: serverTimestamp(),
    }).then(() => {
      // Handle leave
      const groupRef = doc(db, 'groups', selectedGroupId);
      updateDoc(groupRef, {
        members: selectedGroup.members.filter((memberUid) => memberUid !== uid),
      });
      // If isAdmin that remove from admin array
      if (isAdmin) {
        if (selectedGroup.admins.length === 1) {
          updateDoc(groupRef, {
            admins: selectedGroup.members.filter((memberUid) => memberUid !== uid),
          });
        } else {
          updateDoc(groupRef, {
            admins: selectedGroup.admins.filter((memberUid) => memberUid !== uid),
          });
        }
      }
    });
    setIsOpenLeaveGroup(false);
    setSelectedGroupId('');
  };

  const handleCloseModal = () => {
    setIsOpenLeaveGroup(false);
  };
  return (
    <ModalContainer
      open={isOpenLeaveGroup}
      title="Leave Group"
      color="danger"
      formName=""
      actionBtnName="Leave"
      handleClose={handleCloseModal}
      handleAction={handleLeaveGroup}
    >
      <p className={cx('content')}>Are you sure to leave this group?</p>
    </ModalContainer>
  );
}

export default LeaveGroupModal;
