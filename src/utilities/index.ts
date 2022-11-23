import { formatRelative, formatDistanceToNow } from 'date-fns';
export const formatDate = (seconds: number) => {
  let formatedDate = '';
  if (seconds) {
    formatedDate = formatRelative(new Date(seconds * 1000), new Date());
    formatedDate = formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
  }
  return formatedDate;
};

export const formatOfflineTime = (seconds: number) => {
  let formatTime = '';
  if (seconds) {
    formatTime = formatDistanceToNow(new Date(seconds * 1000));
    formatTime = formatTime.charAt(0).toUpperCase() + formatTime.slice(1);
  }
  return formatTime;
};

export const formatFileSize = (size: number) => {
  let formatSize
  if (size > 1024*1024*1024) {
    formatSize = `${(size/(1024*1024*1024)).toFixed(2)} GB`
  } else if (size > 1024*1024) {
    formatSize = `${(size/(1024*1024)).toFixed(2)} MB`
  } else if (size > 1024){
    formatSize = `${(size/(1024)).toFixed(2)} KB`
  } else {
    formatSize = `${size} B`
  }
  return formatSize
}
