import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import { IconButton, Tooltip, Zoom } from '@mui/material';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Members.module.scss';
import Member from '../Member';
import { AppContext } from '../../../../Context/AppProvider';
import { AuthContext } from '../../../../Context/AuthProvider';
import { caretDownIcon, caretLeftIcon } from '../ChatFiles/ChatFiles';

const cx = classNames.bind(styles);

const userPlusIcon = faUserPlus as IconProp

function Members() {
  const [expanded, setExpanded] = useState(true);
  const { modifiedMembers, setIsOpenInviteMember } = useContext(AppContext);
  const { user } = useContext(AuthContext);

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
              <FontAwesomeIcon icon={userPlusIcon} />
            </IconButton>
          </Tooltip>
          <IconButton className={cx('btn')} onClick={handleToggleList}>
            <FontAwesomeIcon icon={expanded ? caretDownIcon : caretLeftIcon} />
          </IconButton>
        </div>
      </header>
      <div className={cx('members', expanded ? 'show' : '')}>
        {modifiedMembers
          .filter((member) => member.uid !== user.uid)
          .map((member) => (
            <Member key={member.uid} {...member} />
          ))}
      </div>
    </div>
  );
}

export default Members;
