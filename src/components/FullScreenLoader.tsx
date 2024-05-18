import React, { FC } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { makeStyles } from '@rneui/themed';

interface LoaderProps {
  fixedFullScreen?: boolean; // Prop to make full-screen behavior configurable
}

const FullScreenLoader: FC<LoaderProps> = ({ fixedFullScreen }) => {
  const styles = useStyles();
  const { width, height } = Dimensions.get('window');

  return (
    <View
      style={[styles.container, fixedFullScreen && styles.fullScreenContainer]}>
      <LottieView
        source={require('../assets/lottie/1.json')} // Use require for local assets
        autoPlay={true}
        loop={true}
        style={[
          styles.animation,
          fixedFullScreen && styles.fullScreenAnimation,
        ]} // Stretch to full screen if fixedFullScreen is true
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional background color
  },
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    zIndex: theme.zIndex.stickyHeader + 1,
  },
  animation: {
    width: '100%', // Adjust as needed
    height: '100%', // Adjust as needed
  },
  fullScreenAnimation: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
}));

export default FullScreenLoader;
