import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { makeStyles, Text, useTheme } from '@rneui/themed';
import { s } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Input from '../../components/Input';

const AuthorSignupScreen = () => {
  const { theme } = useTheme();
  const styles = useStyles();
  const [data, setData] = useState({ firstName: '', lastName: '' });

  const validations = (type: string, value: string) => {
    const updatedValue = value;
    if (['firstName', 'lastName'].includes(type)) {
      return value.substring(0, 30);
    }
    return updatedValue;
  };

  const onChange = (type: string) => (value: string) => {
    setData(prev => ({ ...prev, [type]: validations(type, value) }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons
          name="rocket-outline"
          size={s(24)}
          color="black"
          style={styles.headerIcon}
        />
        <Text style={styles.headerText}>
          One more step before your begin your writing journey
        </Text>
      </View>

      <View style={styles.inputsContainer}>
        <Input
          multiline
          value={data.firstName}
          onChangeText={onChange('firstName')}
          inputStyle={[styles.input]}
          label="Firstname"
          placeholder=""
          autoFocus
        />

        <Input
          multiline
          value={data.lastName}
          onChangeText={onChange('lastName')}
          inputStyle={[styles.input]}
          label="Lastname"
          placeholder=""
        />
      </View>
      <Pressable>
        <View style={styles.footerBtn}>
          <Text style={styles.footerBtnTitle}>Continue</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default AuthorSignupScreen;

const useStyles = makeStyles(theme => ({
  container: {
    padding: s(theme.spacing.lg),
    backgroundColor: theme.colors.white,
  },

  headerContainer: {
    flexDirection: 'row', // Ensures that the icon and text are aligned horizontally
    alignItems: 'center',
  },
  headerIcon: {
    backgroundColor: theme.colors.blue[600],
    color: theme.text.light.white,
    borderRadius: theme.borderRadius.xxl,
    padding: s(theme.spacing.sm),
  },
  headerText: {
    fontSize: s(theme.fontSizes.xl),
    marginLeft: theme.spacing.md, // Adds spacing between the icon and the text
    ...theme.fontWeights.bold,
  },

  inputsContainer: {
    marginVertical: s(20),
  },

  input: {
    borderBottomWidth: 0,
    paddingLeft: 0,
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.normal,
  },

  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.main[600],
    padding: s(theme.spacing.sm),
    borderRadius: s(theme.borderRadius.sm),
  },
  footerBtnTitle: {
    color: theme.text.light.white,
    marginLeft: s(3),
    fontSize: s(theme.fontSizes.base - 3),
    ...theme.fontWeights.bold,
  },
}));
