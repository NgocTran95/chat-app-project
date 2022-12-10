import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import { ButtonBase } from '@mui/material';
import { useContext } from 'react';

import styles from './Profile.module.scss';
import ProfileAvatar from '../../../../components/ProfileAvatar';
import { AuthContext } from '../../../../Context/AuthProvider';
import { AppContext } from '../../../../Context/AppProvider';

const rightFromBracketIcon = faRightFromBracket as IconProp

const cx = classNames.bind(styles);
function Profile() {
  const { user } = useContext(AuthContext);
  const { displayName, photoURL, email } = user
  const { emailUserDisplayName, setIsOpenLogOut } = useContext(AppContext);

  return (
    <article className={cx('container')}>
      <div className={cx('avatar')}>
        <ProfileAvatar status="Online" image={photoURL} width={60} height={60} name={displayName} />
      </div>
      <div className={cx('info')}>
        <h4 className={cx('name')}>{displayName || emailUserDisplayName}</h4>
        <p className={cx('desc')}>{email}</p>
        <p className={cx('status')}>Online</p>
      </div>
      <ButtonBase className={cx('logout')} onClick={() => setIsOpenLogOut(true)}>
        <FontAwesomeIcon icon={rightFromBracketIcon} className={cx('icon')} />
      </ButtonBase>
    </article>
  );
}

export default Profile;
