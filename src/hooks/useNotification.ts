import { PermissionsAndroid, Platform } from 'react-native';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';

const useNotificationPermission = () => {
  async function requestNotificationPermission() {
    let enabled = false;

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_NOTIFICATION_POLICY,
        {
          title: 'Notification Permission',
          message: 'Allow this app to access notifications?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      enabled = granted === PermissionsAndroid.RESULTS.GRANTED;
    } else if (Platform.OS === 'ios') {
      // PushNotificationIOS.requestPermissions();
      // enabled = PushNotificationIOS.checkPermissions().alert === 1;
    }

    if (enabled) {
      console.log('Notification permission granted');
    }

    return enabled;
  }

  return { requestNotificationPermission };
};

export default useNotificationPermission;
