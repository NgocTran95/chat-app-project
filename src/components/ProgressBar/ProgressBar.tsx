import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#76C00D' : '#76C00D',
  },
}));

type Props = {
  value: number,
  width: number,
}
export default function ProgressBar({ value, width }: Props) {
  return (
    <Box sx={{ flexGrow: 1, width }}>
      <BorderLinearProgress variant="determinate" value={value} />
    </Box>
  );
}
