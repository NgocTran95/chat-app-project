import styles from './Profile.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { styled } from '@mui/material/styles';
import { Avatar, Badge, IconButton } from '@mui/material';


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
function Profile() {
  return (
    <article className={cx('container')}>
      <div className={cx('avatar')}>
        <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
          <Avatar
            src="https://9mobi.vn/cf/images/2015/03/nkk/hinh-anh-dep-1.jpg"
            alt="avatar"
            sx={{ width: 60, height: 60 }}
          />
        </StyledBadge>
      </div>
      <div className={cx('info')}>
        <h4 className={cx('name')}>Joe Tran</h4>
        <p className={cx('desc')}>Front-end Dev</p>
        <div className={cx('status')}>Online</div>
      </div>
      <IconButton className={cx('logout')}>
        <FontAwesomeIcon icon={faRightFromBracket} className={cx('icon')} />
      </IconButton>
    </article>
  );
}

export default Profile;
