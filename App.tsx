import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

import Navigator, { linking } from './src/Navigator';
import AuthScreen from './src/components/Auth';
import ErrorBoundary from './src/components/ErrorBoundary';
import useCheckForUpdates from './src/hooks/useInAppUpdate';
import { AppThemeProvider } from './AppThemeProvider';
import useHideSplashScreen from './src/hooks/useHideSplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthProvider';
import useInternetStatus from './src/hooks/useInternetStatus';
import { Text } from '@rneui/themed';

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
    <NavigationContainer linking={linking}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <ErrorBoundary>
            <AuthProvider>
              <AuthScreen>
                <Navigator />
              </AuthScreen>
            </AuthProvider>
          </ErrorBoundary>
        </AppThemeProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
