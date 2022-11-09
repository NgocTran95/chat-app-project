import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './UploadFile.module.scss';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import ProgressBar from '~/components/ProgressBar';
import { useState } from 'react';

const cx = classNames.bind(styles);
function UploadFile({ setIsOpenUploadFile }) {
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleStopEvent = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleBrowseFile = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    setIsUploading(true)
    setFileName(selectedFile.name)
    console.log(URL.createObjectURL(selectedFile));
  }
  const handleDropFile = (e) => {
    handleStopEvent(e)
    const selectedFile = e.dataTransfer.files[0]
    if (!selectedFile) return
    setIsUploading(true)
    setFileName(selectedFile.name)
    console.log(URL.createObjectURL(selectedFile));
  }
  return (
    <div className={cx('container')} onDragEnter={handleStopEvent} onDragOver={handleStopEvent} onDrop={handleDropFile}>
      <div className={cx('inner')}>
        { !isUploading && <button className={cx('close-btn')} onClick={() => setIsOpenUploadFile(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </button>}
        <div className={cx('icon-wrapper')}>
          <FontAwesomeIcon icon={faPaperclip} />
        </div>
        <h1 className={cx('heading')}>Upload File</h1>
        <p className={cx('notification')}>Drag file here or <label htmlFor='file-input' className={cx('input-label')}>browse</label></p>
        <p className={cx('notification')}>Supported file types: JPG, PNG, DOCX, PDF, MP4</p>
        { isUploading && <div className={cx('upload-progress')}>
          <p className={cx('percent')}>75%</p>
          <ProgressBar value={75} width={320}/>
          <p className={cx('loading')}>Uploading <span className={cx('filename')}>{fileName}</span></p>
        </div>}
        <input type='file' style={{display: 'none'}} id='file-input' name='file-input' accept='.jpg,.png,.docx,.doc,.pdf,.mp4' onChange={handleBrowseFile}/>
      </div>
    </div>
  );
}

export default UploadFile;
