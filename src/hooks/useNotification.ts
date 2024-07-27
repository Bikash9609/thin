import { logNotificationPermissionRejected } from '@/analytics';
import { PermissionsAndroid, Platform } from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';
import Snackbar from 'react-native-snackbar';

const checkNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.check(
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    );
    return granted;
  } else if (Platform.OS === 'ios') {
    // Implement iOS permission check using `Permissions.check` (iOS specific)
    // You'll need to request permission from user settings if not granted.
    return false; // Placeholder for iOS check
  } else {
    console.warn('Unsupported platform for notification permission check');
    return false;
  }
};

const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      {
        title: 'Enable App Notifications',
        message:
          'Would you like to receive notifications from this app to stay updated?',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
        buttonNeutral: 'Later',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.BLOCKED) {
      Snackbar.show({
        text: 'Please allow notification permission from settings',
        duration: Snackbar.LENGTH_LONG,
      });
      logNotificationPermissionRejected();
      return false;
    }

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else if (Platform.OS === 'ios') {
    // Implement iOS permission request using `Permissions.request` (iOS specific)
    // You'll need to handle user response and navigate to settings if needed.
    return false; // Placeholder for iOS request
  } else {
    console.warn('Unsupported platform for notification permission request');
    return false;
  }
};

export { checkNotificationPermission, requestNotificationPermission };
