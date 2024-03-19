import { makeStyles } from '@rneui/themed';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { moderateScale, scale, vs } from 'react-native-size-matters';

interface FullScreenComponentProps {
  visible: boolean;
  onClose: () => void;
  content: string;
  header: string;
}

const FullScreenComponent = ({
  visible,
  onClose,
  content,
  header,
}: FullScreenComponentProps) => {
  const styles = useStyles();

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.contentContainer}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.header} numberOfLines={3}>
            {header}
          </Text>
          <Text style={styles.textContent}>{content}</Text>
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  header: {
    marginBottom: scale(10),
    fontSize: scale(theme.fontSizes.base - 3),
    color: theme.text.dark.black,
    ...theme.fontWeights.bold,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 111,
    backgroundColor: theme.colors.white,
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  textContent: {
    lineHeight: scale(20),
    marginBottom: scale(10),
    width: '100%',
    fontSize: scale(theme.fontSizes.sm - 2.4),
    color: theme.text.dark.black,
    ...theme.fontWeights.normal,
  },
  closeButton: {
    width: '100%',
    position: 'absolute',
    bottom: moderateScale(20),
    backgroundColor: theme.colors.blue[800],
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(5),
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}));

export default FullScreenComponent;
