import { Text, makeStyles } from '@rneui/themed';
import React from 'react';
import { TextInput, TextStyle, View } from 'react-native';
import { s } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface InputProps {
  multiline?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  inputStyle?: TextStyle | TextStyle[];
  containerStyle?: TextStyle | TextStyle[];
  labelStyle?: TextStyle | TextStyle[];
  label: string;
  placeholder: string;
  autoFocus?: boolean;
  editable?: boolean;
  errorMessage?: string;
  showError?: boolean;
  onBlur?: (e: any) => void;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({
  multiline,
  value,
  onChangeText,
  inputStyle,
  label,
  placeholder,
  containerStyle,
  labelStyle,
  autoFocus,
  editable,
  errorMessage,
  showError,
  onBlur,
  maxLength,
}) => {
  const styles = useStyles();

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        {maxLength && value.length > 0 && (
          <Text style={styles.maxLength}>{`${value.length}/${maxLength}`}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          autoFocus={autoFocus}
          multiline={multiline}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          style={[styles.input, inputStyle].flat()}
          placeholder={placeholder}
          placeholderTextColor="#999"
          editable={editable}
        />
        {showError && errorMessage && (
          <Ionicons
            name="warning-outline"
            size={s(20)}
            color="red"
            style={styles.errorIcon}
          />
        )}
      </View>
      {showError && errorMessage && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: s(10),
    padding: s(4),
    paddingHorizontal: s(8),
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.blueGray[100],
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Aligns label and max length
  },
  label: {
    marginBottom: s(2),
    color: theme.text.dark.dimGray,
    fontSize: s(theme.fontSizes.xs - 1),
    ...theme.fontWeights.medium,
  },
  maxLength: {
    color: theme.text.dark.dimGray,
    fontSize: s(theme.fontSizes.xs - 3),
    ...theme.fontWeights.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingTop: 0,
    padding: s(10),
    fontSize: s(theme.fontSizes.base - 2),
    color: theme.text.dark.black,
    ...theme.fontWeights.medium,
  },
  errorIcon: {
    marginLeft: s(5),
  },
  errorMessage: {
    marginTop: s(2),
    color: 'red',
    fontSize: s(theme.fontSizes.xs - 1),
  },
}));

export default Input;
