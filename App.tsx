import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import mobileAds from 'react-native-google-mobile-ads';

import Navigator, { linking } from './src/Navigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import useCheckForUpdates from './src/hooks/useInAppUpdate';
import { AppThemeProvider } from './AppThemeProvider';
import useHideSplashScreen from './src/hooks/useHideSplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthProvider';
import useInternetStatus from './src/hooks/useInternetStatus';
import { Text } from '@rneui/themed';
import { initialize } from 'react-native-clarity';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

if (!__DEV__) initialize('myzwwddjj6');

mobileAds()
  .setRequestConfiguration({
    // An array of test device IDs to allow.
    testDeviceIdentifiers: ['EMULATOR'],
  })
  .then(() => {
    console.log('Admob initialized');
  })
  .catch(console.error);

Text.defaultProps = {
  maxFontSizeMultiplier: 1.2,
};

export default function App() {
  useInternetStatus();
  useHideSplashScreen();
  useCheckForUpdates();

  return (
    <GestureHandlerRootView>
      <NavigationContainer linking={linking}>
        <SafeAreaProvider>
          <AppThemeProvider>
            <ErrorBoundary>
              <AuthProvider>
                <Navigator />
              </AuthProvider>
            </ErrorBoundary>
          </AppThemeProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
