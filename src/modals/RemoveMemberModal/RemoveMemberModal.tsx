import { useContext } from 'react';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import classNames from 'classnames/bind';

import styles from './RemoveMemberModal.module.scss';
import { db } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';
import ModalContainer from '../../components/ModalContainer';

const cx = classNames.bind(styles);
function RemoveMemberModal() {
  const {
    isOpenRemoveMember,
    setIsOpenRemoveMember,
    removeMember,
    setRemoveMember,
    selectedGroup,
    selectedGroupId,
    emailUserDisplayName,
  } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const handleRemoveMember = () => {
    const groupRef = doc(db, 'groups', selectedGroupId);
    // Remove member
    updateDoc(groupRef, {
      members: selectedGroup.members.filter((memberUid) => memberUid !== removeMember.uid),
    }).then(() => {
      addDoc(collection(db, 'messages'), {
        type: 'notification',
        text: `${user.displayName || emailUserDisplayName} has removed ${removeMember.displayName} from this group`,
        displayName: user.displayName || emailUserDisplayName,
        groupId: selectedGroupId,
        createAt: serverTimestamp(),
      });
    });
    setRemoveMember({ displayName: '', uid: '' });
    setIsOpenRemoveMember(false);
  };

  const handleCloseModal = () => {
    setIsOpenRemoveMember(false);
  };
  return (
    <ModalContainer
      open={isOpenRemoveMember}
      color="danger"
      formName=""
      title="Remove member"
      actionBtnName="Remove"
      handleClose={handleCloseModal}
      handleAction={handleRemoveMember}
    >
      <p className={cx('content')}>
        Are you sure to remove <span className={cx('remove-member')}>{removeMember?.displayName}</span> ?
      </p>
    </ModalContainer>
  );
}

export default RemoveMemberModal;
