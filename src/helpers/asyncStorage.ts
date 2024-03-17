import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageUtils = {
  async setItem(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting AsyncStorage item:', error);
    }
  },

  async getItem(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting AsyncStorage item:', error);
      return null;
    }
  },

  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing AsyncStorage item:', error);
    }
  },
  async clearAll() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error removing all AsyncStorage items:', error);
    }
  },
};

export default AsyncStorageUtils;
