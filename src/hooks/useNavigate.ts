import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';

function useNavigate() {
  return useNavigation<NavigationProp<ScreensParamsList>>();
}

export default useNavigate;
