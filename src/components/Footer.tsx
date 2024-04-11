import { makeStyles } from '@rneui/themed';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';

function Footer() {
  const styles = useStyles();
  const footerIconSize = scale(23);
  return (
    <View style={[styles.footer]}>
      <View style={styles.reactionIcons}>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="home-outline" size={footerIconSize} color="white" />
          <Text style={styles.iconText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon
            name="person-circle-outline"
            size={footerIconSize}
            color="white"
          />
          <Text style={styles.iconText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  footer: {
    bottom: 0,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: scale(8),
    backgroundColor: 'rgba(0, 0, 0, 0.87)',
    zIndex: 11111,
  },
  reactionIcons: {
    paddingTop: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Adjust width as needed
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconText: {
    fontSize: scale(theme.fontSizes.xs - 2),
    color: theme.text.light.lightGray,
    textAlign: 'center',
    ...theme.fontWeights.medium,
  },
}));

export default Footer;
