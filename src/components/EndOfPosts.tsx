import React, { useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { s, scale, verticalScale, vs } from 'react-native-size-matters';
import LottieView from 'lottie-react-native';
import Button from './UI';
import Header from './Header';
import { useAppBar } from '../context/AppBarProvider';

export interface EndOfPostsProps {
  refreshData: () => void;
}

const EndOfPosts: React.FC<EndOfPostsProps> = ({ refreshData }) => {
  const { toggleAppBarVisibility, isAppBarVisible, setWithoutbackdrop } =
    useAppBar();
  const styles = useStyles();

  useEffect(() => {
    if (!isAppBarVisible) {
      setWithoutbackdrop(true);
      toggleAppBarVisibility();
    }
  }, [isAppBarVisible]);

  return (
    <View style={styles.container}>
      <StatusBar showHideTransition="slide" />
      <View style={styles.centeredContent}>
        <LottieView
          source={require('../assets/lottie/4.json')} // Use require for local assets
          autoPlay={true}
          loop={true}
          style={styles.lottieView} // Avoid full screen stretching
        />
        <Text style={styles.message}>All posts have been displayed</Text>
        <Text style={styles.subtitle}>
          We'll notify you when new posts are available for you
        </Text>
      </View>
      <Button
        title="Refresh"
        onPress={refreshData}
        style={styles.fotterButton}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(20),
  },

  centeredContent: {
    alignItems: 'center',
  },
  lottieView: {
    // Adjust width and height as needed, avoid full-screen stretching
    width: s(350), // Example width, adjust based on your Lottie animation size
    height: s(300), // Example height, adjust based on your Lottie animation size
  },
  message: {
    fontSize: s(theme.fontSizes.xl),
    marginTop: vs(10),
    color: theme.text.dark.dimGray,
    ...theme.fontWeights.bold,
  },
  subtitle: {
    fontSize: s(theme.fontSizes.base - 2),
    color: theme.text.dark.dimGray,
    marginBottom: vs(10),
    textAlign: 'center',
    ...theme.fontWeights.medium,
  },

  fotterButton: {
    marginTop: s(10),
    width: s(150),
  },
}));

export default React.memo(EndOfPosts);