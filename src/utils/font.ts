import { RFValue } from 'react-native-responsive-fontsize';

export function fs(size: number) {
  return RFValue(size);
}

export const fontScale = fs;
