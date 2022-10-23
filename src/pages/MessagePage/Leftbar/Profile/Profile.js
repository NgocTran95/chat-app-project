import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import { auth, db } from '~/firebase/config';
import { useContext, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';

import styles from './Profile.module.scss';
import ProfileAvatar from '~/components/ProfileAvatar';
import { AuthContext } from '~/Context/AuthProvider';

const cx = classNames.bind(styles);
function Profile() {
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
  //     const data = snapshot.docs.map(doc => ({
  //       ...doc.data(),
  //       id: doc.id
  //     }))
  //     console.log({data, snapshot, docs: snapshot.docs});
  //   })
  //   return unsubscribe
  // } , [])

  const { displayName, photoURL, email } = useContext(AuthContext)

  return (
    <article className={cx('container')}>
      <div className={cx('avatar')}>
        <ProfileAvatar
          status="Online"
          image={photoURL}
          width={60}
          height={60}
        />
      </div>
      <div className={cx('info')}>
        <h4 className={cx('name')}>{displayName}</h4>
        <p className={cx('desc')}>{email}</p>
        <div className={cx('status')}>Online</div>
      </div>
      <IconButton className={cx('logout')} onClick={() => auth.signOut()}>
        <FontAwesomeIcon icon={faRightFromBracket} className={cx('icon')} />
      </IconButton>
    </article>
  );
}

export default Profile;
