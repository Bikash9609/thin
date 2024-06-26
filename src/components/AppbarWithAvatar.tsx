import { makeStyles } from '@rneui/themed';
import React from 'react';
import { View, Image, StatusBar, Platform, Dimensions } from 'react-native';
import { s } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthProvider';

const { width } = Dimensions.get('window');

const AppbarWithAvatar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const styles = useStyles();

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/icon.png')} style={styles.logo} />
        </View>

        {isAuthenticated() ? (
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.user?.author?.avatarUrl }}
              style={styles.avatar}
            />
          </View>
        ) : (
          <View style={styles.avatarContainer}>
            <Icon name="person-circle-outline" size={s(30)} color="#000" />
          </View>
        )}
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
    justifyContent: 'space-between',
    paddingHorizontal: s(10),
  },

  logoContainer: {},

  logo: {
    width: s(30),
    height: s(30),
    resizeMode: 'contain',
  },

  avatarContainer: {
    backgroundColor: theme.colors.blueGray[50],
    borderRadius: s(30),
  },

  avatar: {
    width: s(30),
    height: s(30),
    borderRadius: s(20),
  },
}));

export default AppbarWithAvatar;
