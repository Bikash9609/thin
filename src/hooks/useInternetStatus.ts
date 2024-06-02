// useInternetStatus.ts
import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';

const useInternetStatus = (): boolean => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const handleConnectivityChange = (state: NetInfoState) => {
      if (state.isConnected !== isConnected) {
        if (!state.isConnected) {
          Snackbar.show({
            text: 'No internet connection',
            duration: Snackbar.LENGTH_INDEFINITE,
            backgroundColor: 'red',
          });
        } else {
          Snackbar.dismiss();
          Snackbar.show({
            text: 'Internet back',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'green',
          });
        }
        setIsConnected(state.isConnected ?? true);
      }
    };

    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  return isConnected;
};

export default useInternetStatus;
