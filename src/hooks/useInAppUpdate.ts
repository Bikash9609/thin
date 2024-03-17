import { useEffect } from 'react';
import { Platform } from 'react-native';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import DeviceInfo from 'react-native-device-info';

const inAppUpdates = new SpInAppUpdates(!!__DEV__); // Initialize SpInAppUpdates instance

const useCheckForUpdates = () => {
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const { shouldUpdate } = await inAppUpdates.checkNeedsUpdate({
          curVersion: DeviceInfo.getVersion(), // App version
        });
        if (shouldUpdate) {
          let updateOptions: StartUpdateOptions = {};
          if (Platform.OS === 'android') {
            updateOptions = {
              updateType: IAUUpdateKind.FLEXIBLE,
            };
          }
          await inAppUpdates.startUpdate(updateOptions);
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    checkForUpdates();

    // Clean up any resources if needed
    return () => {
      // Cleanup logic here
    };
  }, []);

  return null; // You can modify this to return any necessary values or state
};

export default useCheckForUpdates;
