import { useEffect, useRef, useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostResponse } from '.';
import AsyncStorageUtils from '../../helpers/asyncStorage';

const GUIDE_KEY = 'carouselGuideSeen';

interface UseCarouselGuideProps {
  enabled: boolean;
}

function useCarouselGuide({ enabled }: UseCarouselGuideProps) {
  const carouselRef = useRef<any>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  const checkGuideStatus = async () => {
    const value = await AsyncStorageUtils.getItem(GUIDE_KEY);
    if (value === 'true') {
      setHasScrolled(true);
    }
  };

  const saveGuideStatus = async () => {
    await AsyncStorageUtils.setItem(GUIDE_KEY, 'true');
  };

  const triggerScroll = useCallback(() => {
    if (carouselRef.current && !hasScrolled) {
      // Scroll to the next slide and then back to the first slide
      setTimeout(() => {
        carouselRef.current?.snapToNext();
        setTimeout(() => {
          carouselRef.current?.snapToItem(0);
        }, 1000); // Delay to allow users to see the scroll
      }, 1000); // Initial delay after component mounts
    }
  }, [hasScrolled]);

  useEffect(() => {
    checkGuideStatus();
  }, []);

  useEffect(() => {
    if (enabled && !hasScrolled) {
      const intervalId = setInterval(triggerScroll, 3000); // Trigger scroll every 3 seconds
      return () => clearInterval(intervalId);
    }
  }, [enabled, hasScrolled, triggerScroll]);

  const onScroll = () => {
    if (!hasScrolled) {
      setHasScrolled(true);
      saveGuideStatus();
    }
  };

  return {
    carouselRef,
    fireAgain: triggerScroll,
    onScroll,
  };
}

export default useCarouselGuide;
