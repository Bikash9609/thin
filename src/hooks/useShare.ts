import React, { useRef } from 'react';
import { View, Alert } from 'react-native';
import { captureScreen, CaptureOptions } from 'react-native-view-shot';
import Share from 'react-native-share';
import useShareLink from './useShareLink';
import Snackbar from 'react-native-snackbar';

interface ShareOptions {
  title: string;
  message: string;
  url: string;
  social: string;
}

interface Props {
  storyUuid: string;
}

const useShare = ({ storyUuid }: Props) => {
  const { getShareLink, isLoading, shareLink } = useShareLink({
    storyUuid,
  });

  const viewRef = useRef<View>(null);

  const handleShare = async (opts: Partial<ShareOptions>) => {
    try {
      if (!viewRef.current?.props?.style) {
        return Alert.alert('Error', 'Failed to capture screen.');
      }

      const res = await getShareLink();

      if (!res?.url) return;

      // Capture the current screen
      const options: CaptureOptions = {
        format: 'jpg',
        quality: 0.8,
        result: 'data-uri',
        snapshotContentContainer: false,
        width: (viewRef as any).current.props.style.width,
        height: (viewRef as any).current.props.style.height,
      };
      const uri = await captureScreen(options);

      // Share the screenshot and message
      const shareOptions: Partial<ShareOptions> = {
        title: `Get latest dev short blogs, news and regular updates on the only Thin App`,
        message: `Checkout the Thin App. Get latest dev short blogs, news and regular updates on the only Thin App. Download the app ${res.url}`,
        url: uri,
        ...opts,
        social: Share.Social.WHATSAPP, // You can change the platform here
      };

      await Share.shareSingle(shareOptions as any);
    } catch (error) {
      console.error('Error sharing screenshot:', error);
      Snackbar.show({
        text: 'Error sharing story. Please try again!',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  return { handleShare, viewRef, isLoading };
};

export default useShare;
