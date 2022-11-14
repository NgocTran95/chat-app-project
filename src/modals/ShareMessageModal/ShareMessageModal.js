import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faShare } from '@fortawesome/free-solid-svg-icons';
import { Fade, Modal, Backdrop, IconButton, ButtonBase, Checkbox, Avatar } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useMemo, useState } from 'react';

import { AppContext } from '~/Context/AppProvider';
import classNames from 'classnames/bind';
import styles from './ShareMessageModal.module.scss';
import { fileIcons } from '~/constants';
import { CheckCircle, CircleOutlined } from '@mui/icons-material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '~/firebase/config';
import { AuthContext } from '~/Context/AuthProvider';

const cx = classNames.bind(styles);
function ShareMessageModal() {
  const {
    shareMessage,
    setShareMessage,
    groups,
    selectedGroupId,
    emailUserDisplayName,
    setToastMessage,
    toastMessage,
  } = useContext(AppContext);
  const { uid, photoURL, displayName } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [shareGroups, setShareGroups] = useState([]);
  const groupList = useMemo(() => {
    return groups.filter((group) => group.id !== selectedGroupId);
  }, [groups, selectedGroupId]);

  const handleSelectShareGroup = (event, id) => {
    if (event.target.checked) {
      setShareGroups((prev) => [...prev, id]);
    } else {
      setShareGroups((prev) => prev.filter((groupId) => groupId !== id));
    }
  };

  const handleShareMessage = () => {
    if (shareGroups.length === 0) return;
    shareGroups.forEach((groupId) => {
      addDoc(collection(db, 'messages'), {
        type: shareMessage.type.split('/')[0],
        text: shareMessage.name,
        [shareMessage.type.split('/')[0]]: { ...shareMessage },
        uid,
        photoURL,
        comment,
        displayName: displayName || emailUserDisplayName,
        groupId,
        hearts: [],
        createAt: serverTimestamp(),
      });
    });
    setToastMessage({ ...toastMessage, open: true, message: 'Share message successfully', severity: 'success' });
    setComment('');
    setShareMessage(null);
    setShareGroups([]);
  };

  const handleCloseModal = () => {
    setComment('');
    setShareMessage(null);
    setShareGroups([]);
  };
  if (!shareMessage) return;
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={!!shareMessage}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={!!shareMessage}>
        <Box className={cx('container')}>
          <header className={cx('header')}>
            <h4>Share message</h4>
            <IconButton className={cx('close-btn')} onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
          </header>
          <div className={cx('body')}>
            <div className={cx('share')}>
              <header className={cx('share-header')}>Share message content</header>
              <div className={cx('share-content')}>
                {shareMessage.type.split('/')[0] === 'application' && (
                  <img src={fileIcons[shareMessage.type]} className={cx('file-icon')} alt="file-icon" />
                )}
                {shareMessage.type.split('/')[0] === 'image' && (
                  <img src={shareMessage.downloadURL} className={cx('share-img')} alt="file-icon" />
                )}
                {shareMessage.type.split('/')[0] === 'video' && (
                  <img src={fileIcons[shareMessage.type]} className={cx('share-img')} alt="file-icon" />
                )}
                <div className={cx('share-info')}>
                  <header className={cx('share-info-header')}>
                    <FontAwesomeIcon icon={faShare} />
                    <p>
                      {shareMessage.type.split('/')[0] === 'application'
                        ? '[FILE]'
                        : `[${shareMessage.type.split('/')[0].toUpperCase()}]`}
                    </p>
                  </header>
                  <p className={cx('share-info-text')}>{shareMessage.name}</p>
                </div>
              </div>
              {shareMessage.type !== 'message' && (
                <input
                  className={cx('comment')}
                  type="text"
                  placeholder="Add your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              )}
            </div>
            <div className={cx('groups')}>
              <header className={cx('groups-header')}>Select groups to share</header>
              <div className={cx('group-list')}>
                {groupList.map((group) => (
                  <label key={group.id} className={cx('group')}>
                    <Checkbox
                      icon={<CircleOutlined />}
                      checkedIcon={<CheckCircle />}
                      sx={{ '& .MuiSvgIcon-root': { fontSize: 25 } }}
                      onChange={(event) => handleSelectShareGroup(event, group.id)}
                    />
                    <Avatar
                      className={cx('group-avatar')}
                      src={group.avatarURL}
                      alt={group.name}
                      sx={{ width: 40, height: 40 }}
                    />
                    <p className={cx('group-name')}>{group.name}</p>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className={cx('btn-groups')}>
            <ButtonBase variant="outlined" className={cx('btn')} onClick={handleCloseModal}>
              Cancel
            </ButtonBase>
            <ButtonBase
              variant="contained"
              type="submit"
              className={cx('btn', 'share-btn')}
              onClick={handleShareMessage}
            >
              Share
            </ButtonBase>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default ShareMessageModal;
