import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigator from './src';
import AuthScreen from './src/components/Auth';
import ErrorBoundary from './src/components/ErrorBoundary';
import useFirebasePushNotifications from './src/hooks/useFcmToken';
import useCheckForUpdates from './src/hooks/useInAppUpdate';
import { AppThemeProvider } from './AppThemeProvider';
import useHideSplashScreen from './src/hooks/useHideSplashScreen';

// TODO: need to add Loading screen
// TODO: add internal linking for the app
// TODO: need to add Error boundary
// TODO: need to add navbar with logo of app - future
// TODO: throw snackbar error alerts on refresh, error

// Thin: Rapid news

export default function App() {
  useHideSplashScreen();
  useFirebasePushNotifications();
  useCheckForUpdates();

  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <ErrorBoundary>
          <AuthScreen>
            <Navigator />
          </AuthScreen>
        </ErrorBoundary>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
