import LottieView from 'lottie-react-native';
import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

const AuthLoading: React.FC = () => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 130,
    height: 130,
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
    width: 350, // Example width, adjust based on your Lottie animation size
    height: 250, // Example height, adjust based on your Lottie animation size
  },
  loadingText: {
    marginTop: 10,
    color: '#333',
  },
  formContainer: {
    // Styles for your login form
  },
});

export default AuthLoading;
