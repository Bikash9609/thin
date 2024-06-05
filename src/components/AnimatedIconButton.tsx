import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AnimatedIconButtonProps {
  iconName: string;
  label: string;
  timeToHide: number;
  onPress: () => void;
  isInView: boolean;
  containerStyles?: ViewStyle[];
  iconStyles?: ViewStyle[];
  labelStyles?: TextStyle[];
}

const AnimatedIconButton: React.FC<AnimatedIconButtonProps> = ({
  label,
  timeToHide,
  onPress,
  iconName,
  containerStyles,
  iconStyles,
  labelStyles,
  isInView,
}) => {
  const [expanded, setExpanded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isInView) setExpanded(true);
  }, [isInView]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (expanded) {
      timer = setTimeout(() => {
        hideLabel();
      }, timeToHide * 1000);
    }
    return () => clearTimeout(timer);
  }, [expanded, timeToHide]);

  const hideLabel = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setExpanded(false));
  };

  const showLabel = () => {
    setExpanded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        hideLabel();
      }, timeToHide * 1000);
    });
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (!expanded) {
          showLabel();
        }
      }}
      style={[styles.attribute, containerStyles ?? []].flat()}>
      {iconName && (
        <Icon
          style={[styles.attributeIcon, iconStyles ?? []].flat()}
          name={iconName}
          color="#fff"
        />
      )}
      {expanded && (
        <Pressable onPress={onPress}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text
              style={
                [
                  styles.attributeText,
                  styles.authorAttr,
                  labelStyles ?? [],
                ].flat() as TextStyle
              }
              numberOfLines={1}>
              {label}
            </Text>
          </Animated.View>
        </Pressable>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  attribute: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  attributeIcon: {
    marginRight: 8,
  },
  attributeText: {
    color: '#fff',
  },
  authorAttr: {
    fontSize: 16,
  },
});

export default AnimatedIconButton;
