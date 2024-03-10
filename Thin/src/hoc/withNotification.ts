import messaging from '@react-native-firebase/messaging';

const useNotificationPermission = () => {
  async function requestNotificationPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
    return enabled;
  }

  return { requestNotificationPermission };
};

export default useNotificationPermission;
