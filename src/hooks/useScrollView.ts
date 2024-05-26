import { useRef } from 'react';
import { ScrollView } from 'react-native';

interface ScrollMethods {
  scrollToTop: (animated?: boolean) => void;
  scrollToBottom: (animated?: boolean) => void;
  scrollToOffset: (y: number, animated?: boolean) => void;
  scrollToEnd: (animated?: boolean) => void;
  getScrollViewRef: () => React.RefObject<ScrollView>;
}

const useScrollView = (): ScrollMethods => {
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToTop = (animated: boolean = true) => {
    scrollViewRef.current?.scrollTo({ y: 0, animated });
  };

  const scrollToBottom = (animated: boolean = true) => {
    scrollViewRef.current?.scrollToEnd({ animated });
  };

  const scrollToOffset = (y: number, animated: boolean = true) => {
    scrollViewRef.current?.scrollTo({ y, animated });
  };

  const scrollToEnd = (animated: boolean = true) => {
    scrollViewRef.current?.scrollToEnd({ animated });
  };

  const getScrollViewRef = () => scrollViewRef;

  return {
    scrollToTop,
    scrollToBottom,
    scrollToOffset,
    scrollToEnd,
    getScrollViewRef,
  };
};

export default useScrollView;
