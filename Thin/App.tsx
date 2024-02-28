import React from 'react';

import Navigator from './src';
import AuthScreen from './src/components/Auth';
import ErrorBoundary from './src/components/ErrorBoundary';

// TODO: need to add Loading screen
// TODO: add internal linking for the app
// TODO: need to add Error boundary
// TODO: need to add navbar with logo of app - future
// TODO: throw snackbar error alerts on refresh, error

export default function App() {
  return (
    <ErrorBoundary>
      <AuthScreen>
        <Navigator />
      </AuthScreen>
    </ErrorBoundary>
  );
}
