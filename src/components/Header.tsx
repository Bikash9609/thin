import { makeStyles, useTheme } from '@rneui/themed';
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

const { height } = Dimensions.get('window');

interface HeaderProps {
  rightButtonIconName?: string;
  rightButtonText?: string;
  fixed?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  rightButtonIconName,
  rightButtonText,
  fixed = false,
}) => {
  const { navigate } = useNavigation() as any;
  const { isAuthenticated } = useAuth();
  const { isAppBarVisible, toggleAppBarVisibility } = useAppBar();
  const { theme } = useTheme();
  const styles = useStyles();
  const containerStyle = fixed ? styles.fixedContainer : styles.container;
  const shadowStyle = fixed ? styles.shadow : null;

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

        {rightButtonIconName && (
          <TouchableOpacity
            style={styles.rightContainer}
            onPress={() => {
              navigate('AddStory');
              toggleAppBarVisibility();
            }}>
            <Ionicons
              name={rightButtonIconName}
              size={s(24)}
              color={theme.colors.white}
            />
            {rightButtonText && (
              <Text style={styles.rightText}>{rightButtonText}</Text>
            )}
          </TouchableOpacity>
        )}
        <View style={styles.rightGroup}>
          <TouchableOpacity
            style={styles.personIconContainer}
            onPress={() => {
              navigate('ProfileScreen');
              toggleAppBarVisibility();
            }}>
            <Ionicons
              name="person-circle-outline"
              size={s(24)}
              color={theme.text.dark.black}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
      {fixed && isAppBarVisible && (
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
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          />
        </Pressable>
      )}
    </Pressable>
  );
};

const useStyles = makeStyles(theme => ({
  appIcon: {
    width: s(24), // Adjust the width as needed
    height: s(24), // Adjust the height as needed
    marginRight: s(8), // Adjust the margin as needed
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingVertical: s(4),
    paddingHorizontal: s(20),
  },
  fixedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    lineHeight: s(20),
    color: theme.colors.white,
    fontSize: s(theme.fontSizes.base - 1),
    ...theme.fontWeights.medium,
  },
}));

export default Header;
