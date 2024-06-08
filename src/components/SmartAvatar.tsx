import React, { useState } from 'react';

import { Avatar, Icon, makeStyles } from '@rneui/themed';
import { Pressable, View } from 'react-native';
import { s } from 'react-native-size-matters';

interface SmartAvatarProps {
  src: string;
  size: number;
  icon?: string;
  onPress?: () => void;
  forceLoading?: boolean;
}

const SmartAvatar: React.FC<SmartAvatarProps> = ({
  src,
  size,
  icon,
  onPress,
  forceLoading,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const styles = useStyles();

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Avatar
          size={size}
          rounded
          source={{ uri: src ?? require('../assets/2.png') }}
          containerStyle={styles.avatarContainer}
          avatarStyle={styles.avatar}
          imageProps={{ onLoad: handleImageLoad }}
        />
        {(loading || forceLoading) && (
          <View style={styles.overlay}>
            <Icon
              name="refresh"
              type="ionicon"
              color="white"
              size={s(20)}
              style={styles.loadingIcon}
            />
          </View>
        )}
        {icon && (
          <View style={styles.iconContainer}>
            <View style={styles.iconOverlay} />
            <Icon
              name={icon}
              type="ionicon"
              color="white"
              size={s(26)}
              onPress={onPress}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
  },
  avatarContainer: {
    height: s(100),
    width: s(100),
    borderRadius: s(100),
    overflow: 'hidden', // Ensure the Avatar clips the Overlay
  },
  avatar: {
    height: '100%',
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust darkness level here
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: s(100),
    zIndex: 111,
  },
  loadingIcon: {
    backgroundColor: theme.colors.blue[600],
    padding: s(4),
    borderRadius: s(4),
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust darkness level here
    borderRadius: s(100),
    height: '100%',
    width: '100%',
  },
}));

export default SmartAvatar;
