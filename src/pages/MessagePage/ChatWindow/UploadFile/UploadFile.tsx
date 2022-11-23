import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPaperclip, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import styles from './UploadFile.module.scss';
import { storage, db } from '../../../../firebase/config';
import { AppContext } from '../../../../Context/AppProvider';
import { AuthContext } from '../../../../Context/AuthProvider';
import ProgressBar from '../../../../components/ProgressBar';

const cx = classNames.bind(styles);
type Props = {
  setIsOpenUploadFile: React.Dispatch<React.SetStateAction<boolean>>;
};

type fileValues = {
  name: string;
  type: string;
  size: number;
};

const paperClipIcon = faPaperclip as IconProp
const xmarkIcon = faXmark as IconProp


function UploadFile({ setIsOpenUploadFile }: Props) {
  const { emailUserDisplayName, selectedGroupId } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const { displayName, photoURL, uid } = user;
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [file, setFile] = useState<fileValues>({name: '', type: '', size: 0});
  const [progress, setProgress] = useState<number>(0);

  const handleStopEvent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpenUploadFile(true);
  };
  const handleBrowseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile;
    if (e.target.files) {
      selectedFile = e.target.files[0];
    }
    if (!selectedFile) return;
    handleSendFileToStorage(selectedFile);
  };
  const handleDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    handleStopEvent(e);
    const selectedFile = e.dataTransfer.files[0];
    const acceptedFilesType = [
      'vnd.openxmlformats-officedocument.wordprocessingml.document',
      'msword',
      'pdf',
      'mp4',
      'png',
      'jpeg',
    ];
    if (!selectedFile) return;
    if (!acceptedFilesType.includes(selectedFile.type.split('/')[1])) return;
    handleSendFileToStorage(selectedFile);
  };
  const handleSendFileToStorage = (selectedFile: Blob) => {
    const { name, type, size } = selectedFile;
    setIsUploading(true);
    setFile({ name, type, size });
    const storageRef = ref(storage, `${type.split('/')[0]}/${name}`);
    const metadata = {
      contentType: `${type}`,
    };
    const uploadTask = uploadBytesResumable(storageRef, selectedFile, metadata);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          addDoc(collection(db, 'messages'), {
            type: `${type.split('/')[0]}`,
            text: name,
            [type.split('/')[0]]: { downloadURL, size, name, type },
            photoURL,
            uid,
            displayName: displayName || emailUserDisplayName,
            groupId: selectedGroupId,
            hearts: [],
            createAt: serverTimestamp(),
          }).then(() => {
            setProgress(0);
            setFile({name: '', type: '', size: 0});
            setIsUploading(false);
            setIsOpenUploadFile(false);
          });
        });
      },
    );
  };
  return (
    <div
      className={cx('container')}
      onDragEnter={handleStopEvent}
      onDragOver={handleStopEvent}
      onDragLeave={() => setIsOpenUploadFile(false)}
      onDrop={handleDropFile}
    >
      <div className={cx('inner')}>
        {!isUploading && (
          <button className={cx('close-btn')} onClick={() => setIsOpenUploadFile(false)}>
            <FontAwesomeIcon icon={xmarkIcon} />
          </button>
        )}
        <div className={cx('icon-wrapper')}>
          <FontAwesomeIcon icon={paperClipIcon} />
        </div>
        <h1 className={cx('heading')}>Upload File</h1>
        <p className={cx('notification')}>
          Drag file here or{' '}
          <label htmlFor="file-input" className={cx('input-label')}>
            browse
          </label>
        </p>
        <p className={cx('notification')}>Supported file types: JPG, PNG, DOC, DOCX, PDF, MP4</p>
        {isUploading && (
          <div className={cx('upload-progress')}>
            <p className={cx('percent')}>{progress.toFixed()}%</p>
            <ProgressBar value={progress} width={320} />
            <p className={cx('loading')}>
              Uploading <span className={cx('filename')}>{file.name}</span>
            </p>
          </div>
        )}
        <input
          type="file"
          style={{ display: 'none' }}
          id="file-input"
          name="file-input"
          accept=".jpg,.png,.docx,.doc,.pdf,.mp4"
          onChange={handleBrowseFile}
        />
      </div>
    </div>
  );
}

export default UploadFile;
