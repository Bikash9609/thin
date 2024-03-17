import React, { FC } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

interface LoaderProps {}

const FullScreenLoader: FC<LoaderProps> = () => {
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lottie/1.json')} // Use require for local assets
        autoPlay={true}
        loop={true}
        style={{ width, height }} // Stretch to full screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional background color
  },
});

export default FullScreenLoader;
