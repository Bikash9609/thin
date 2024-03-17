import messaging from '@react-native-firebase/messaging';

const useNotificationPermission = () => {
  async function requestNotificationPermission() {
    console.log('here');
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }

    // Check if the app has notification permission from the user
    const hasPermission = await messaging().hasPermission();

    console.log('Has permission:', hasPermission);

    return enabled && hasPermission;
  }

  return { requestNotificationPermission };
};

export default useNotificationPermission;
