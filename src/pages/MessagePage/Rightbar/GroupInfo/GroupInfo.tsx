import classNames from 'classnames/bind';
import { Avatar, IconButton, MenuItem } from '@mui/material';
import { DeleteForever, Edit, ExitToApp, MoreVert, PersonAdd } from '@mui/icons-material';
import { useContext, useState } from 'react';

import styles from './GroupInfo.module.scss';
import { AppContext } from '../../../../Context/AppProvider';
import { formatDate } from '../../../../utilities';
import { StyledMenu } from '../../../../components/StyledMenu/StyledMenu';

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleClickToggleBtn = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  if (selectedGroupId === '') return <></>;
  const { name, members, avatarURL } = selectedGroup;
  const lastMessage = messages[messages.length - 1];

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
            anchorEl={anchorEl}
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
        <p className={cx('member-quantity')}>{members.length} members</p>
        <p className={cx('last-msg-info')}>
          <span>Last message: </span>
          <span>{formatDate(lastMessage.createAt?.seconds)}</span>
        </p>
      </div>
    </div>
  );
}

export default GroupInfo;
