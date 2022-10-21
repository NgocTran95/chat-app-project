import { Avatar, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import classNames from 'classnames/bind';
import styles from './ChatRoom.module.scss';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(0.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const cx = classNames.bind(styles);
function ChatRoom({ isActive }) {
  return (
    <div className={cx('container', `${isActive ? 'active' : ''}`)}>
      <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
        <Avatar
          sx={{ width: 50, height: 50 }}
          src="https://theimportantsite.com/wp-content/uploads/2020/04/family-1466262_1280-2.jpg"
          alt="avatar"
        />
      </StyledBadge>
      <div className={cx('infor')}>
        <div className={cx('group-name')}>Funny Friends</div>
        <p className={cx('last-msg')}>
          <span className="person">Me</span>: <span className={cx('content')}>Hey Jeff, come on! Where r u now?</span>
        </p>
      </div>
      <span className={cx('unread-msg')}>3</span>
    </div>
  );
}

export default ChatRoom;
