import { useContext } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';

import { AppContext } from '../../Context/AppProvider';
import classNames from 'classnames/bind';
import styles from './DeleteGroupModal.module.scss';
import { db } from '../../firebase/config';
import ModalContainer from '../../components/ModalContainer';

const cx = classNames.bind(styles);
function DeleteGroupModal() {
  const { isOpenDeleteGroup, setIsOpenDeleteGroup, selectedGroupId, setSelectedGroupId, messages } =
    useContext(AppContext);
  const handleDeleteGroup = () => {
    // Delete group
    deleteDoc(doc(db, 'groups', selectedGroupId));
    // Delete all messages in group
    messages.forEach((message) => {
      deleteDoc(doc(db, 'messages', message.id));
    });
    setSelectedGroupId('');
    setIsOpenDeleteGroup(false);
  };

  const handleCloseModal = () => {
    setIsOpenDeleteGroup(false);
  };
  return (
    <ModalContainer open={isOpenDeleteGroup} title='Delete Group' color='danger' formName='' actionBtnName='Delete' handleClose={handleCloseModal} handleAction={handleDeleteGroup}>
      <p className={cx('content')}>Are you sure to delete this group?</p>
    </ModalContainer>
  );
}

export default DeleteGroupModal;
