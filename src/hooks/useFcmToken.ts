import { useEffect } from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { request } from '../axios';

import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import useNotificationPermission from './useNotification';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  return remoteMessage;
});

//KillState
messaging().getInitialNotification();

const useFirebasePushNotifications = (): void => {
  const { requestNotificationPermission } = useNotificationPermission();

  useEffect(() => {
    const handlePermissionAndToken = async (): Promise<void> => {
      try {
        // Request permission for receiving push notifications
        const permission = await requestNotificationPermission();
        if (!permission) return;

        // Get the device token
        const fcmToken: string | undefined = await messaging().getToken();

        if (fcmToken) {
          // Send the FCM token to your backend server
          sendTokenToBackend(fcmToken);
        } else {
          console.log('Failed to get FCM token.');
        }
      } catch (error) {
        console.log('Permission denied', error);
      }
    };

    handlePermissionAndToken();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('A new FCM message arrived!', remoteMessage);
        // Handle the incoming message here
      },
    );

    return unsubscribe;
  }, []);

  const sendTokenToBackend = async (token: string): Promise<void> => {
    try {
      console.log('Sending token to backend:', token);

      const deviceInfo = {
        platform: Platform.OS, // Platform (e.g., "ios", "android")
        deviceId: DeviceInfo.getUniqueIdSync(), // Unique device ID
        model: DeviceInfo.getModel(), // Device model (e.g., "iPhone X", "Samsung Galaxy S20")
        manufacturer: DeviceInfo.getManufacturerSync(), // Device manufacturer (e.g., "Apple", "Samsung")
        appVersion: DeviceInfo.getVersion(), // App version
        systemVersion: DeviceInfo.getSystemVersion(), // Operating system version
        buildNumber: DeviceInfo.getBuildNumber(), // Build number (Android) or build version (iOS)
        bundleId: DeviceInfo.getBundleId(), // Bundle ID (iOS) or application ID (Android)
        isEmulator: DeviceInfo.isEmulatorSync(), // Whether the device is an emulator
        isTablet: DeviceInfo.isTablet(), // Whether the device is a tablet
        apiLevel: DeviceInfo.getApiLevelSync(),
        ipAddress: DeviceInfo.getIpAddressSync(),
        userAgent: DeviceInfo.getUserAgentSync(),
        isLowRamDevice: DeviceInfo.isLowRamDevice(),
      };

      await request({
        method: 'post',
        url: '/fcm/capture',
        data: { token, deviceInfo: JSON.stringify(await deviceInfo) },
      });
    } catch (error) {
      console.log('Error', error);
    }
  };
};

export default useFirebasePushNotifications;