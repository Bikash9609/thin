import { makeStyles } from '@rneui/themed';
import LottieView from 'lottie-react-native';
import React from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import { s } from 'react-native-size-matters';
import Header from './Header';

const LoadingOfPosts: React.FC = () => {
  const styles = useStyles();

  return (
    <View style={styles.main}>
      <StatusBar showHideTransition="slide" />
      <Header
        isAppBarVisible
        toggleAppBarVisibility={() => {}}
        withoutBackdrop
      />
      <View style={styles.container}>
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
            <Text style={styles.loadingText}>
              Loading more items, thank you for your patience!
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main: { backgroundColor: '#fff', height: '100%' },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: s(50),
    height: s(50),
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContent: {
    alignItems: 'center',
  },
  lottieView: {
    width: s(350), // Example width, adjust based on your Lottie animation size
    height: s(300), // Example height, adjust based on your Lottie animation size
  },
  loadingText: {
    maxWidth: '80%',
    textAlign: 'center',
    color: theme.text.dark.dimGray,
    ...theme.fontWeights.medium,
  },
  formContainer: {
    // Styles for your login form
  },
}));

export default LoadingOfPosts;
