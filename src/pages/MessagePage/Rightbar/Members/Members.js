import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import { IconButton, Tooltip, Zoom } from '@mui/material';
import { faCaretDown, faCaretLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppContext } from '~/Context/AppProvider';
import { AuthContext } from '~/Context/AuthProvider';
import styles from './Members.module.scss';
import Member from '../Member';


const cx = classNames.bind(styles);
function Members() {
  const [expanded, setExpanded] = useState(true);
  const { modifiedMembers, setIsOpenInviteMember } = useContext(AppContext);
  const { uid } = useContext(AuthContext);

  // Toggle list
  const handleToggleList = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <h5 className={cx('title')}>People</h5>
        <div className={cx('tools')}>
          <Tooltip
            title="Invite member"
            TransitionComponent={Zoom}
            PopperProps={{ sx: { '& .MuiTooltip-tooltip': { fontSize: 10 } } }}
          >
            <IconButton className={cx('btn')} onClick={() => setIsOpenInviteMember(true)}>
              <FontAwesomeIcon icon={faUserPlus} />
            </IconButton>
          </Tooltip>
          <IconButton className={cx('btn')} onClick={handleToggleList}>
            <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretLeft} />
          </IconButton>
        </div>
      </header>
      <div className={cx('members', expanded ? 'show' : '')}>
        {modifiedMembers
          .filter((member) => member.uid !== uid)
          .map((member) => (
            <Member key={member.uid} {...member} />
          ))}
      </div>
    </div>
  );
}

export default Members;
