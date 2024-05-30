import moment from 'moment';
import { Image } from 'react-native-compressor';

export async function compressImage(uri: string, quality: number = 0.8) {
  return Image.compress(uri, {
    compressionMethod: 'manual',
    maxWidth: 1000,
    quality,
  });
}

export const renderMetaText = (datePublished: string) => {
  const now = moment();
  const publishedTime = moment(datePublished);
  const diffInHours = now.diff(publishedTime, 'hours');
  const diffInDays = now.diff(publishedTime, 'days');
  const diffInMonths = now.diff(publishedTime, 'months');

  if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};
