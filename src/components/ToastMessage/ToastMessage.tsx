import { Snackbar, Alert } from '@mui/material';
import { useContext } from 'react';
import { AppContext } from '../../Context/AppProvider';

function ToastMessage() {
  const { toastMessage, setToastMessage } = useContext(AppContext);
  const { vertical, horizontal, open, severity, message } = toastMessage;
  const handleClose = () => {
    setToastMessage({ ...toastMessage, open: false });
  };
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      key={vertical + horizontal}
      autoHideDuration={5000}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{ width: '100%', fontSize: 14, fontWeight: 500, fontFamily: 'inherit' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ToastMessage;
