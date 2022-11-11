import docIcon from '~/assets/images/doc-icon.svg';
import imageIcon from '~/assets/images/image-icon.svg';
import mp4Icon from '~/assets/images/mp4-icon.svg';
import pdfIcon from '~/assets/images/pdf-icon.svg';

export const statusColors = {
  Online: '#44b700',
  Away: '#ffb400',
  Offline: '#afbbc6',
};

export const fileIcons = {
  'application/pdf': pdfIcon,
  'application/msword': docIcon,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': docIcon,
  'video/mp4': mp4Icon,
  'image/png': imageIcon,
  'image/jpeg': imageIcon,
};
