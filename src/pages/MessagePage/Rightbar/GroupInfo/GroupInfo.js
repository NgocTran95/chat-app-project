import classNames from 'classnames/bind';
import styles from './GroupInfo.module.scss';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';

import { useContext, useState } from 'react';
import { AppContext } from '~/Context/AppProvider';
import { formatDate } from '~/utilities';
import { DeleteForever, Edit, ExitToApp, MoreVert, PersonAdd } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

const StyledMenu = styled((props) => (
  <Menu 
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(0),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      fontSize: 12,
      fontFamily: 'Montserrat',
      fontWeight: 500,
      minHeight: 40,
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

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
