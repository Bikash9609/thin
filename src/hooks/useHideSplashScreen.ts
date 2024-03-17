import React, { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';

function useHideSplashScreen() {
  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);
}

export default useHideSplashScreen;
