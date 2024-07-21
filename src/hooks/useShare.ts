import React, { useRef } from 'react';
import { View, Alert, Dimensions } from 'react-native';
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

const { width, height } = Dimensions.get('window');

const useShare = ({ storyUuid }: Props) => {
  const { getShareLink, isLoading, shareLink } = useShareLink({
    storyUuid,
  });

  const viewRef = useRef<View>(null);

  const handleShare = async (opts: Partial<ShareOptions>) => {
    try {
      if (!viewRef.current) {
        return Snackbar.show({
          text: 'Error sharing story. Please try again!',
          duration: Snackbar.LENGTH_SHORT,
        });
      }

      let urlToShare = shareLink;

      if (!shareLink) {
        const res = await getShareLink();
        if (!res?.url) return;

        urlToShare = res.url;
      }

      // Capture the current screen
      const options: CaptureOptions = {
        format: 'jpg',
        quality: 1,
        result: 'data-uri',
        snapshotContentContainer: false,
      };
      const uri = await captureScreen(options);

      // Share the screenshot and message
      const shareOptions = {
        title: 'Get the latest dev blogs and updates on Thin App',
        message: `Check out Thin App for dev blogs, news, and updates. Download now: ${urlToShare}`,
        url: uri,
        showAppsToView: true,
        failOnCancel: false,
        ...opts,
        // social: Share.Social.WHATSAPP, // You can change the platform here
      };

      await Share.open(shareOptions as any);
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
