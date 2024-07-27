import { useEffect } from 'react';
import { Alert, BackHandler, Platform } from 'react-native';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
  IAUInstallStatus,
} from 'sp-react-native-in-app-updates';

export const checkForUpdate = async () => {
  const inAppUpdates = new SpInAppUpdates(__DEV__);
  // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
  try {
    if (Platform.OS === 'ios') {
      return;
    }
    await inAppUpdates.checkNeedsUpdate().then(result => {
      try {
        if (result.shouldUpdate) {
          let updateOptions: StartUpdateOptions = {};
          if (Platform.OS === 'android') {
            // android only, on iOS the user will be promped to go to your app store page
            updateOptions = {
              updateType: IAUUpdateKind.IMMEDIATE,
            };
          }

          inAppUpdates.addStatusUpdateListener(downloadStatus => {
            console.log('download status', downloadStatus);
            if (downloadStatus.status === IAUInstallStatus.DOWNLOADED) {
              console.log('downloaded');
              Alert.alert(
                'Closing App',
                'App is going to close to install the updates.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      BackHandler.exitApp();
                      inAppUpdates.installUpdate();
                      inAppUpdates.removeStatusUpdateListener(finalStatus => {
                        console.log('final status', finalStatus);
                      });
                      inAppUpdates.startUpdate(updateOptions);
                    },
                  },
                ],
                { cancelable: false },
              );
            }
          });

          inAppUpdates.startUpdate(updateOptions);
        }
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const useCheckForUpdates = () => {
  useEffect(() => {
    checkForUpdate();
  }, []);

  return null; // You can modify this to return any necessary values or state
};

export default useCheckForUpdates;
