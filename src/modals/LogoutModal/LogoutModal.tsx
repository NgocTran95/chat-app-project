import { useContext } from 'react';
import classNames from 'classnames/bind';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

import styles from './LogoutModal.module.scss';
import { auth, db } from '../../firebase/config';
import { AppContext } from '../../Context/AppProvider';
import ModalContainer from '../../components/ModalContainer';

const cx = classNames.bind(styles);
function LogoutModal() {
  const { isOpenLogOut, setIsOpenLogOut, setSelectedGroupId, userId, setUserId } = useContext(AppContext);

  const handleLogout = () => {
    // Set offline status when logout
    updateDoc(doc(db, 'users', userId), { status: { state: 'Offline', last_changed: serverTimestamp() } }).then(() => {
      // Logout
      auth.signOut();
      setSelectedGroupId('');
      setUserId('');
      setIsOpenLogOut(false);
    });
  };

  const handleCloseModal = () => {
    setIsOpenLogOut(false);
  };
  return (
    <ModalContainer
      open={isOpenLogOut}
      title="Log out"
      color="danger"
      actionBtnName="Log out"
      formName=""
      handleClose={handleCloseModal}
      handleAction={handleLogout}
    >
      <p className={cx('content')}>Are you sure to log out?</p>
    </ModalContainer>
  );
}

export default LogoutModal;
