import { Text } from '@rneui/themed';
import React, { useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import {
  TestIds,
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

interface AdInterstitialProps {
  style?: ViewStyle;
}

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-9791957935297347/1063892275';

export const BannerAdUnit: React.FC<AdInterstitialProps> = ({ style }) => {
  const bannerRef = useRef<BannerAd>(null);

  return (
    <BannerAd
      ref={bannerRef}
      unitId={adUnitId}
      size={BannerAdSize.MEDIUM_RECTANGLE}
    />
  );
};
