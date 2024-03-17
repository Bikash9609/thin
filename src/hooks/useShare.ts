import React, { useRef } from 'react';
import { View, Alert } from 'react-native';
import { captureScreen, CaptureOptions } from 'react-native-view-shot';
import Share from 'react-native-share';

interface ShareOptions {
  title: string;
  message: string;
  url: string;
  social: string;
}

const useShare = () => {
  const viewRef = useRef<View>(null);

  const handleShare = async (opts: Partial<ShareOptions>) => {
    try {
      if (!viewRef.current?.props?.style) {
        return Alert.alert('Error', 'Failed to capture screen.');
      }

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

      // Construct the message
      const message = 'Check out this app! Download it now.';

      // Share the screenshot and message
      const shareOptions: ShareOptions = {
        title: 'Share via',
        message: message,
        url: uri,
        ...opts,
        social: Share.Social.WHATSAPP, // You can change the platform here
      };

      await Share.shareSingle(shareOptions as any);
    } catch (error) {
      console.error('Error sharing screenshot:', error);
      Alert.alert('Error', 'Failed to share screenshot.');
    }
  };

  return { handleShare, viewRef };
};

export default useShare;
