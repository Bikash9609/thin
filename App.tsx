import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

// TODO: need to add Loading screen
// TODO: add internal linking for the app
// TODO: need to add Error boundary
// TODO: need to add navbar with logo of app - future
// TODO: throw snackbar error alerts on refresh, error

// Thin: Rapid news

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
