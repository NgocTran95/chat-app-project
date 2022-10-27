import { formatRelative } from 'date-fns';
export const formatDate = (seconds) => {
  let formatedDate = '';
  if (seconds) {
    formatedDate = formatRelative(new Date(seconds * 1000), new Date());
    formatedDate = formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
  }
  return formatedDate;
};
