import { makeStyles } from '@rneui/themed';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { s } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import config from '../../config/config';

interface HeaderProps {
  handleStepChange: () => void;
  activeStep: number;
  onClose: () => void;
  disabled?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onClose,
  handleStepChange,
  activeStep,
  disabled,
}) => {
  const styles = useStyles();
  const handleOpenLink = (link: string | undefined) => () => {
    if (link) {
      Linking.openURL(link);
    }
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={onClose}>
        <View style={styles.leftContent}>
          <Ionicons name="close-outline" size={s(24)} color="black" />
          <Text style={styles.title}>Create Post</Text>
        </View>
      </Pressable>

      <View style={styles.stackRow}>
        <Pressable
          onPress={handleOpenLink(config.howToWritePostUrl)}
          style={styles.helpIcon}>
          <View style={styles.leftContent}>
            <Ionicons name="help-circle-outline" size={s(24)} color="black" />
          </View>
        </Pressable>

        <TouchableOpacity
          onPress={handleStepChange}
          style={styles.addButton}
          disabled={disabled}>
          <Text style={styles.addButtonText}>
            {activeStep > 2 ? 'Publish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
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
    color: theme.text.dark.black,
    marginLeft: 10,
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.bold,
  },
  stackRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpIcon: {
    marginRight: s(10),
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
