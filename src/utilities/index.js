import { formatRelative, formatDistanceToNow } from 'date-fns';
export const formatDate = (seconds) => {
  let formatedDate = '';
  if (seconds) {
    formatedDate = formatRelative(new Date(seconds * 1000), new Date());
    formatedDate = formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
  }
  return formatedDate;
};

export const formatOfflineTime = (seconds) => {
  let formatTime = '';
  if (seconds) {
    formatTime = formatDistanceToNow(new Date(seconds * 1000));
    formatTime = formatTime.charAt(0).toUpperCase() + formatTime.slice(1);
  }
  return formatTime;
};
