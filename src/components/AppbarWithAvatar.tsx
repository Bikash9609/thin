import { makeStyles } from '@rneui/themed';
import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { s } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const AppbarWithAvatar: React.FC = () => {
  const styles = useStyles();

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/icon.png')} style={styles.logo} />
        </View>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  header: {
    width,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    paddingVertical: s(5),
    borderBottomWidth: 1,
    borderBottomColor: theme.border.color.lightGray,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(10),
  },

  logoContainer: {},

  logo: {
    width: s(30),
    height: s(30),
    resizeMode: 'contain',
  },
}));

export default AppbarWithAvatar;
