import { makeStyles } from '@rneui/themed';
import LottieView from 'lottie-react-native';
import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { s, vs } from 'react-native-size-matters';

const AuthLoading: React.FC = () => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={styles.logo} />

      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />

        {/* Wrap LottieView and loading text in a separate container */}
        <View style={styles.centeredContent}>
          <LottieView
            source={require('../assets/lottie/2.json')} // Use require for local assets
            autoPlay={true}
            loop={true}
            style={styles.lottieView} // Avoid full screen stretching
          />
          <Text style={styles.loadingText}>Preparing your experience...</Text>
        </View>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: s(130),
    height: s(130),
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContent: {
    alignItems: 'center',
  },
  lottieView: {
    // Adjust width and height as needed, avoid full-screen stretching
    width: s(350), // Example width, adjust based on your Lottie animation size
    height: s(300), // Example height, adjust based on your Lottie animation size
  },
  loadingText: {
    marginTop: vs(10),
    color: theme.text.dark.dimGray,
    ...theme.fontWeights.medium,
  },
  formContainer: {
    // Styles for your login form
  },
}));

export default AuthLoading;
