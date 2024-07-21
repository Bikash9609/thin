import { fs } from '@/utils/font';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Animated,
} from 'react-native';
import { s } from 'react-native-size-matters';
import Stack from './Stack';

interface LoadingPillProps {
  isLoading: boolean; // Prop to control visibility of the loading indicator
  message?: string; // Optional prop for displaying text next to the indicator
}

const LoadingPill: React.FC<LoadingPillProps> = ({ isLoading, message }) => {
  const styles = useStyles();
  const [isVisible, setIsVisible] = useState(false); // Track visibility state
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      // Animate drop down on mount
      Animated.timing(translateY, {
        toValue: 0, // Final position (0 for at the top)
        duration: 300, // Animation duration
        useNativeDriver: true, // Improve performance (optional)
      }).start();
    } else {
      setIsVisible(false);
      // Animate back up on unmount
      Animated.timing(translateY, {
        toValue: -100, // Final position (off-screen)
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    isVisible && (
      <Animated.View style={[styles.mainContainer]}>
        <Animated.View
          style={[styles.container, { transform: [{ translateY }] }]}>
          <ActivityIndicator
            size="small"
            color="white"
            style={styles.indicator}
          />
          {message && <Text style={styles.text}>{message}</Text>}
        </Animated.View>
      </Animated.View>
    )
  );
};

export default LoadingPill;

const useStyles = makeStyles(theme => ({
  mainContainer: {
    position: 'absolute',
    zIndex: theme.zIndex.stickyHeader + 1000,
    top: s(8),
    left: 0,
    right: 0,
  },
  container: {
    alignSelf: 'center',
    width: s(130),
    backgroundColor: theme.colors.dark[50],
    opacity: 0.8, // Adjust opacity for partial transparency
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(5), // Add padding for better spacing
    flexDirection: 'row', // Arrange indicator and text horizontally
    borderRadius: s(30),
    // Shadow for a more elevated look (optional)
    shadowColor: theme.colors.gray[500] || 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  indicator: {
    marginRight: 10, // Add margin for spacing between indicator and text
  },
  text: {
    fontSize: fs(12),
    color: theme.text.light.white, // Text color for visibility on black background
    ...theme.fontWeights.medium,
  },
}));
