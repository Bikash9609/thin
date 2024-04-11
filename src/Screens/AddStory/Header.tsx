import { makeStyles } from '@rneui/themed';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { s } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  handleStepChange: () => void;
  activeStep: number;
  onClose: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onClose,
  handleStepChange,
  activeStep,
}) => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Pressable onPress={onClose}>
        <View style={styles.leftContent}>
          <Ionicons name="close-outline" size={s(24)} color="black" />
          <Text style={styles.title}>Create Post</Text>
        </View>
      </Pressable>
      <TouchableOpacity onPress={handleStepChange} style={styles.addButton}>
        <Text style={styles.addButtonText}>
          {activeStep > 2 ? 'Publish' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'white',
    padding: s(10),
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 10,
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.bold,
  },
  addButton: {
    backgroundColor: theme.colors.blue[600],
    paddingVertical: s(5),
    paddingHorizontal: s(10),
    borderRadius: s(5),
  },
  addButtonText: {
    color: 'white',
    fontSize: s(theme.fontSizes.base - 2),
    ...theme.fontWeights.bold,
  },
}));

export default Header;
