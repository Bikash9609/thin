import React, { Component, ReactElement } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';

const window = Dimensions.get('window');
interface ErrorBoundaryProps {
  children: ReactElement;
}

interface ErrorBoundaryState {
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = {
    error: undefined,
  };

  static getDerivedStateFromError(error: Error) {
    // Update state so the error boundary UI is shown
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught in ErrorBoundary:', error);
  }

  handleResetError = () => {
    // Reset the error state
    this.setState({ error: undefined });
  };

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if (!error) {
      return children; // Render children if no error
    }

    // Replace with your actual Lottie animation source file
    const animationSource = require('../assets/lottie/3.json');

    return (
      <View style={styles.container}>
        <LottieView
          source={animationSource}
          autoPlay={true}
          loop={false}
          style={styles.animation}
        />
        <Text style={styles.text}>Oops, something went wrong!</Text>
        <TouchableOpacity onPress={this.handleResetError} style={styles.button}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animation: {
    width: window.width,
    height: window.width,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: 10,
    width: 100,
    textAlign: 'center',
  },
});

export default ErrorBoundary;
