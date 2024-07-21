import { Avatar, makeStyles, useTheme } from '@rneui/themed';
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { s } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppBar } from '../context/AppBarProvider';
import { Image } from 'react-native';
import { useAuth } from '../context/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { fs } from '../utils/font';

const { height } = Dimensions.get('window');

interface HeaderProps {
  fixed?: boolean;
  isAppBarVisible: boolean;
  toggleAppBarVisibility: () => void;
  withoutBackdrop?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  fixed = false,
  isAppBarVisible,
  toggleAppBarVisibility,
  withoutBackdrop = false,
}) => {
  const { navigate } = useNavigation() as any;
  const { isAuthenticated, getUserInfo } = useAuth();
  const { theme } = useTheme();
  const styles = useStyles();
  const containerStyle = fixed ? styles.fixedContainer : styles.container;
  const shadowStyle = fixed ? styles.shadow : null;
  const userInfo = getUserInfo();

  // Using useRef to keep a reference to the animated value
  const translateYAnim = useRef(new Animated.Value(0)).current;
  // Using useRef to keep a reference to the animated value
  const spacerHeightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the translateY based on the isAppBarVisible state
    Animated.timing(translateYAnim, {
      toValue: isAppBarVisible ? 0 : -100, // Adjust this value as needed
      duration: 300, // Animation duration
      useNativeDriver: true, // Enable native driver for performance
    }).start();
  }, [isAppBarVisible, translateYAnim]);

  useEffect(() => {
    // Animate the spacer height based on the isAppBarVisible state
    Animated.timing(spacerHeightAnim, {
      toValue: isAppBarVisible ? height : 0, // Adjust this value as needed
      duration: 300, // Animation duration
      useNativeDriver: false, // Animation is not using native driver as height cannot be animated with native driver
    }).start();
  }, [isAppBarVisible, spacerHeightAnim]);

  if (!isAuthenticated()) return;

  return (
    <Pressable onPress={toggleAppBarVisibility}>
      <Animated.View
        style={[
          containerStyle,
          shadowStyle,
          { transform: [{ translateY: translateYAnim }] },
        ]}>
        <Image source={require('../assets/icon.png')} style={styles.appIcon} />
        {/* 
        <TouchableOpacity
          style={styles.rightContainer}
          onPress={() => {
            navigate(userInfo?.authorId ? 'AddStory' : 'AuthorSignupScreen');
            toggleAppBarVisibility();
          }}>
          <Ionicons
            name="add-circle-outline"
            size={s(18)}
            color={theme.colors.white}
          />

          <Text style={styles.rightText}>Add</Text>
        </TouchableOpacity> */}

        {/* <View style={styles.rightGroup}>
          <TouchableOpacity
            style={styles.personIconContainer}
            onPress={() => {
              // navigate('ProfileScreen');
              toggleAppBarVisibility();
            }}>
            {userInfo?.author?.avatarUrl ? (
              <Avatar
                source={{ uri: userInfo.author.avatarUrl }}
                avatarStyle={styles.profileAvatar}
                rounded
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={s(32)}
                color={theme.text.dark.black}
              />
            )}
          </TouchableOpacity>
        </View> */}
      </Animated.View>
      {fixed && isAppBarVisible && !withoutBackdrop && (
        <Pressable
          onPress={toggleAppBarVisibility}
          onTouchMove={toggleAppBarVisibility}>
          <Animated.View
            style={{
              width: '100%',
              height: spacerHeightAnim,
              position: 'absolute',
              zIndex: theme.zIndex.stickyHeader - 1,
              top: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,0)',
            }}
          />
        </Pressable>
      )}
    </Pressable>
  );
};

const useStyles = makeStyles(theme => ({
  appIcon: {
    width: s(29), // Adjust the width as needed
    height: s(32), // Adjust the height as needed
    marginRight: s(8), // Adjust the margin as needed
    aspectRatio: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingVertical: s(4),
    paddingHorizontal: s(20),
  },
  fixedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: s(4),
    paddingHorizontal: s(20),
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: theme.zIndex.stickyHeader,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  personIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: s(30),
    marginLeft: s(5),
  },
  profileAvatar: {},
  rightGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: s(30),
    backgroundColor: theme.colors.blue[700],
    borderWidth: s(theme.border.size.hairline),
    borderRadius: s(20),
    paddingLeft: s(3),
    paddingRight: s(10),
    borderColor: theme.border.color.blue,
  },
  rightText: {
    marginLeft: s(3),
    lineHeight: s(18),
    color: theme.colors.white,
    fontSize: fs(theme.fontSizes.base - 2),
    ...theme.fontWeights.medium,
  },
}));

export default Header;
