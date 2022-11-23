import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { Fade, Modal, Backdrop, IconButton, Checkbox, Avatar, Button } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useMemo, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import classNames from 'classnames/bind';
import { CheckCircle, CircleOutlined } from '@mui/icons-material';

import styles from './ShareMessageModal.module.scss';
import { db } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';
import { fileIcons } from '../../Constants';
import { closeIcon } from '../AddGroupModal/AddGroupModal';

const shareIcon = faShare as IconProp

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
  const { user } = useContext(AuthContext);
  const { uid, photoURL, displayName } = user
  const [comment, setComment] = useState<string>('');
  const [shareGroups, setShareGroups] = useState<string []>([]);
  const groupList = useMemo(() => {
    return groups.filter((group) => group.id !== selectedGroupId);
  }, [groups, selectedGroupId]);

  const handleSelectShareGroup = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
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
    setShareMessage({id: '', displayName: '', type: '', name: '', size: 0, downloadURL: ''});
    setShareGroups([]);
  };

  const handleCloseModal = () => {
    setComment('');
    setShareMessage({id: '', displayName: '', type: '', name: '', size: 0, downloadURL: ''});
    setShareGroups([]);
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={!!shareMessage.id}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={!!shareMessage.id}>
        <Box className={cx('container')}>
          <header className={cx('header')}>
            <h4>Share message</h4>
            <IconButton className={cx('close-btn')} onClick={handleCloseModal}>
              <FontAwesomeIcon icon={closeIcon} />
            </IconButton>
          </header>
          <div className={cx('body')}>
            <div className={cx('share')}>
              <header className={cx('share-header')}>Share message content</header>
              <div className={cx('share-content')}>
                {shareMessage.type === 'application/pdf' && (
                  <img src={fileIcons['application/pdf']} className={cx('file-icon')} alt="file-icon" />
                )}
                {shareMessage.type === 'application/msword' && (
                  <img src={fileIcons['application/msword']} className={cx('file-icon')} alt="file-icon" />
                )}
                {shareMessage.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
                  <img src={fileIcons['application/vnd.openxmlformats-officedocument.wordprocessingml.document']} className={cx('file-icon')} alt="file-icon" />
                )}
                {shareMessage.type.split('/')[0] === 'image' && (
                  <img src={shareMessage.downloadURL} className={cx('share-img')} alt="file-icon" />
                )}
                {shareMessage.type === 'video/mp4' && (
                  <img src={fileIcons['video/mp4']} className={cx('share-img')} alt="file-icon" />
                )}
                <div className={cx('share-info')}>
                  <header className={cx('share-info-header')}>
                    <FontAwesomeIcon icon={shareIcon} />
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
                {groupList.length === 0 ? (
                  <p className={cx('nogroup-notification')}>There are no groups to share...</p>
                ) : (
                  groupList.map((group) => (
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
                  ))
                )}
              </div>
            </div>
          </div>
          <div className={cx('btn-groups')}>
            <button className={cx('btn')} onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              type="submit"
              className={cx('btn', 'share-btn')}
              onClick={handleShareMessage}
            >
              Share
            </button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default ShareMessageModal;
