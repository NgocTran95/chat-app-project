import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Fade, Modal, Backdrop, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import classNames from 'classnames/bind';

import styles from './ModalContainer.module.scss';

type Props = {
  children: JSX.Element;
  open: boolean;
  title: string;
  color: 'primary' | 'danger';
  formName: string;
  actionBtnName: string;
  handleClose: () => void;
  handleAction: () => void;
};

export const closeIcon = faClose as IconProp;
const cx = classNames.bind(styles);
function ModalContainer({ children, open, title, color, formName, actionBtnName, handleClose, handleAction }: Props) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className={cx('container')}>
          <header className={cx('header')}>
            <h4>{title}</h4>
            <IconButton className={cx('close-btn')} onClick={handleClose}>
              <FontAwesomeIcon icon={closeIcon} />
            </IconButton>
          </header>
          {children}
          <div className={cx('btn-groups')}>
            <button className={cx('btn')} onClick={handleClose}>
              Cancel
            </button>
            <button
              type="submit"
              form={formName}
              className={cx('btn', color)}
              onClick={handleAction}
            >
              {actionBtnName}
            </button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default ModalContainer;
