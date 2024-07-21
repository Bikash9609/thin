import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { ms, s, vs } from 'react-native-size-matters';
import LottieView from 'lottie-react-native';
import Button from '@/components/UI';
import Header from '@/components/Header';

export interface NoNewsItemsProps {
  refreshData: () => void;
}

const EndOfPosts: React.FC<NoNewsItemsProps> = ({ refreshData }) => {
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
        <View style={styles.centeredContent}>
          <LottieView
            source={require('../../assets/lottie/5.json')} // Use require for local assets
            autoPlay={true}
            loop={false}
            style={styles.lottieView} // Avoid full screen stretching
          />
          <Text style={styles.message}>
            There was an error retrieving your feed.
          </Text>
          <Text style={styles.subtitle}>Please try again.</Text>
        </View>
        <Button
          title="Refresh"
          onPress={refreshData}
          style={styles.fotterButton}
        />
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main: { backgroundColor: '#fff', height: '100%' },
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
    textAlign: 'center',
    fontSize: ms(theme.fontSizes.base),
    marginTop: vs(10),
    color: theme.text.dark.dimGray,
    ...theme.fontWeights.bold,
  },
  subtitle: {
    fontSize: ms(theme.fontSizes.xs),
    maxWidth: '85%',
    color: theme.text.dark.dimGray,
    marginBottom: s(10),
    textAlign: 'center',
    ...theme.fontWeights.medium,
  },

  fotterButton: {
    marginTop: s(10),
    width: s(150),
  },
}));

export default React.memo(EndOfPosts);
