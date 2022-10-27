import { IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './Members.module.scss';
import { faCaretDown, faCaretLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';
import Member from '../Member';
import { AppContext } from '~/Context/AppProvider';
import { AuthContext } from '~/Context/AuthProvider';

const cx = classNames.bind(styles);
function Members() {
  const [expanded, setExpanded] = useState(true);
  const { members, setIsOpenInviteMember } = useContext(AppContext)
  const { uid } = useContext(AuthContext)
  const handleToggleList = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <h5 className={cx('title')}>People</h5>
        <div className={cx('tools')}>
          <IconButton className={cx('btn')} onClick={() => setIsOpenInviteMember(true)}>
            <FontAwesomeIcon icon={faUserPlus} />
          </IconButton>
          <IconButton className={cx('btn')} onClick={handleToggleList}>
            <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretLeft} />
          </IconButton>
        </div>
      </header>
      <div className={cx('members', expanded ? 'show' : '')}>
        {members
          .filter((member) => member.uid !== uid)
          .map((member) => (
            <Member key={member.uid} {...member} />
          ))}
      </div>
    </div>
  );
}

export default Members;
