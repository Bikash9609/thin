import { makeStyles } from '@rneui/themed';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { s } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  title: string;
  onBackPress: () => void;
  height: 'sm' | 'md' | 'lg';
}

const GenericAppbar: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  height,
}) => {
  const styles = useStyles();
  const getHeight = () => {
    switch (height) {
      case 'sm':
        return s(40);
      case 'md':
        return s(50);
      case 'lg':
        return s(90);
      default:
        return s(70);
    }
  };

  return (
    <View style={[styles.container, { height: getHeight() }]}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: s(theme.fontSizes.base),
    color: theme.text.dark.black,
    ...theme.fontWeights.bold,
  },
}));

export default GenericAppbar;
