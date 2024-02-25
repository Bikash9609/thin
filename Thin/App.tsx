import React from 'react';

import Navigator from './src';
import AuthScreen from './src/components/Auth';

export default function App() {
  return (
    <AuthScreen>
      <Navigator />
    </AuthScreen>
  );
}
