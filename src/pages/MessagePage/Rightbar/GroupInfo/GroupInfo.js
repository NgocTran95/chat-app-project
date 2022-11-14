import classNames from 'classnames/bind';
import styles from './GroupInfo.module.scss';
import { Avatar, IconButton, MenuItem } from '@mui/material';

import { useContext, useState } from 'react';
import { AppContext } from '~/Context/AppProvider';
import { formatDate } from '~/utilities';
import { DeleteForever, Edit, ExitToApp, MoreVert, PersonAdd } from '@mui/icons-material';
import { StyledMenu } from '~/components/StyledMenu/StyledMenu';

const cx = classNames.bind(styles);
function GroupInfo() {
  const {
    selectedGroup,
    selectedGroupId,
    messages,
    setIsOpenEditGroup,
    setIsOpenLeaveGroup,
    setIsOpenDeleteGroup,
    setIsOpenInviteMember,
    isAdmin,
  } = useContext(AppContext);
  // Toggle Side Menu
  const [anchorMenu, setAnchorMenu] = useState(null);
  const openMenu = Boolean(anchorMenu);
  const handleClickToggleBtn = (event) => {
    setAnchorMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  if (selectedGroupId === '') return;
  const { name, members, avatarURL } = selectedGroup;
  const lastMessage = (messages[messages.length - 1]);

  return (
    <div className={cx('container')}>
      <div className={cx('avatar')}>
        <Avatar src={avatarURL} sx={{ width: 50, height: 50 }} alt="avatar">
          {avatarURL ? '' : name?.charAt(0).toUpperCase()}
        </Avatar>
      </div>
      <div className={cx('details')}>
        <div className={cx('name')}>
          <h4>{name}</h4>
          <IconButton
            id="group-info-menu-btn"
            className={cx('group-info-menu-btn')}
            aria-controls={openMenu ? 'group-info-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            onClick={handleClickToggleBtn}
          >
            <MoreVert className={cx('group-info-menu-btn-icon')} />
          </IconButton>
          <StyledMenu
            id="group-info-menu"
            aria-labelledby="group-info-menu-btn"
            anchorEl={anchorMenu}
            open={openMenu}
            onClose={handleCloseMenu}
          >
            <MenuItem
              onClick={() => {
                setIsOpenEditGroup(true);
                handleCloseMenu();
              }}
            >
              <Edit />
              Edit group
            </MenuItem>
            <MenuItem
              onClick={() => {
                setIsOpenInviteMember(true);
                handleCloseMenu();
              }}
            >
              <PersonAdd />
              Invite members
            </MenuItem>
            <MenuItem
              onClick={() => {
                setIsOpenLeaveGroup(true);
                handleCloseMenu();
              }}
            >
              <ExitToApp />
              Leave group
            </MenuItem>
            {isAdmin && (
              <MenuItem
                onClick={() => {
                  setIsOpenDeleteGroup(true);
                  handleCloseMenu();
                }}
              >
                <DeleteForever />
                Delete group
              </MenuItem>
            )}
          </StyledMenu>
        </div>
        <p className={cx('member-quantity')}>{members?.length} members</p>
        <p className={cx('last-msg-info')}>
          <span>Last message: </span>
          <span>{formatDate(lastMessage?.createAt?.seconds)}</span>
        </p>
      </div>
    </div>
  );
}

export default GroupInfo;
