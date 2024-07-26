import { useEffect, useRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';

type UseScreenTrackingProps = {
  navigationRef: React.RefObject<NavigationContainerRef<any>>;
};

const useScreenTracking = ({ navigationRef }: UseScreenTrackingProps) => {
  const routeNameRef = useRef<string | undefined>();

  const trackScreenView = async (routeName: string) => {
    analytics().logScreenView({
      screen_class: routeName,
      screen_name: routeName,
    });
  };

  useEffect(() => {
    const onReady = () => {
      routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
    };

    const onStateChange = async () => {
      const previousRouteName = routeNameRef.current;
      const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

      if (previousRouteName !== currentRouteName) {
        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;

        // Track the new screen view
        if (currentRouteName) {
          await trackScreenView(currentRouteName);
        }
      }
    };

    // Attach listeners
    const navigation = navigationRef.current;
    navigation?.addListener('state', onStateChange);

    // Initialize onReady
    onReady();

    // Clean up listeners on unmount
    return () => {
      navigation?.removeListener('state', onStateChange);
    };
  }, [navigationRef]);
};

export default useScreenTracking;
