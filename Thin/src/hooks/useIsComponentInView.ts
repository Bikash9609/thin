import { useState, useRef, useEffect } from 'react';
import { View, LayoutRectangle, Dimensions } from 'react-native';

const useIsComponentInView = (): [boolean, React.RefObject<View>] => {
  const [isInView, setIsInView] = useState<boolean>(false);
  const componentRef = useRef<View>(null);
  const componentLayout = useRef<LayoutRectangle | null>(null);

  useEffect(() => {
    const handleLayout = (event: {
      nativeEvent: { layout: LayoutRectangle };
    }) => {
      componentLayout.current = event.nativeEvent.layout;
    };

    const handleScroll = () => {
      if (componentLayout.current) {
        const windowHeight = Dimensions.get('window').height;
        const { y, height } = componentLayout.current;
        if (y >= 0 && y + height <= windowHeight) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      }
    };

    const resizeListener = Dimensions.addEventListener('change', handleScroll);

    if (componentRef.current) {
      componentRef.current.measure((x, y, width, height, pageX, pageY) => {
        componentLayout.current = { x, y: pageY, width, height };
        handleScroll(); // Check initial state
      });
    }

    componentRef.current?.setNativeProps({ onLayout: handleLayout });

    return () => {
      // Remove the event listener on component unmount
      resizeListener.remove();
    };
  }, []);

  return [isInView, componentRef];
};

export default useIsComponentInView;
