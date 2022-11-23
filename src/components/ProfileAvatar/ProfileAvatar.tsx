import { Avatar, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';

type Profile = {
  image: string | null,
  name: string | null,
  status: string,
  width: number,
  height: number,
}

function ProfileAvatar({ image, name, status, width, height }: Profile) {
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: status === 'Online' ? '#44b700' : '#afbbc6',
      color: status === 'Online' ? '#44b700' : '#afbbc6',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: `${status === 'Online' ? 'ripple 1.2s infinite ease-in-out' : ''}`,
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
  return (
    <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
      <Avatar sx={{ width, height }} src={image || ''} alt={name ? name : 'avatar'} />
    </StyledBadge>
  );
}

export default ProfileAvatar;
