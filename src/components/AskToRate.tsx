import React, { useCallback, useRef } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { makeStyles } from '@rneui/themed';
import { s } from 'react-native-size-matters';
import { fs } from '@/utils/font';

const AskToRate = ({
  onClose,
  onRate,
}: {
  onClose: () => void;
  onRate: () => void;
}) => {
  const styles = useStyles();
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleRateNow = () => {
    onRate();
  };

  const handleSkip = () => {
    // Add any logic for skipping, such as closing the bottom sheet
    bottomSheetRef.current?.close();
  };

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        onClose={onClose}
        onChange={handleSheetChanges}
        snapPoints={['90%']}>
        <BottomSheetView style={styles.contentContainer}>
          <Image
            source={require('../assets/rate.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Enjoying the app?</Text>
          <Text style={styles.subtitle}>Please rate us on the Play Store</Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </Pressable>
            <Pressable style={styles.rateNowButton} onPress={handleRateNow}>
              <Text style={styles.rateNowButtonText}>Rate now</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  centeredContent: {
    alignItems: 'center',
  },
  image: {
    width: s(350),
    height: s(300),
  },
  container: {
    flex: 1,
    padding: s(24),
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: fs(theme.fontSizes.xxl),
    marginBottom: s(10),
    color: theme.text.dark.black,
    ...theme.fontWeights.bold,
  },
  subtitle: {
    fontSize: fs(theme.fontSizes.lg),
    color: 'grey',
    marginBottom: s(20),
    ...theme.fontWeights.semiBold,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: s(20),
  },
  rateNowButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: s(10),
    borderRadius: s(5),
    alignItems: 'center',
    marginRight: 10,
  },
  rateNowButtonText: {
    color: 'white',
    ...theme.fontWeights.bold,
  },
  skipButton: {
    flex: 1,
    padding: s(10),
    borderRadius: s(5),
    backgroundColor: theme.colors.blueGray[50],
    alignItems: 'center',
    marginLeft: 10,
    ...theme.fontWeights.medium,
  },
  skipButtonText: {
    color: 'black',
    ...theme.fontWeights.medium,
  },
}));

export default AskToRate;
