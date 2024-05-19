import { Text, makeStyles } from '@rneui/themed';
import React from 'react';
import { TextInput, TextStyle, View } from 'react-native';
import { s } from 'react-native-size-matters';

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
}) => {
  const styles = useStyles();
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        autoFocus={autoFocus}
        multiline={multiline}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, inputStyle].flat()}
        placeholder={placeholder}
        placeholderTextColor="#999"
        editable={editable}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: s(10),
    borderWidth: theme.border.size.hairline,
    borderColor: theme.border.color.lightGray,
    padding: s(4),
    paddingHorizontal: s(8),
    borderRadius: theme.borderRadius.md,
  },
  label: {
    marginBottom: s(2),
    color: theme.text.dark.dimGray,
    fontSize: s(theme.fontSizes.xs - 1),
    ...theme.fontWeights.medium,
  },
  input: {
    paddingTop: 0,
    padding: s(10),
    fontSize: s(theme.fontSizes.base),
    color: theme.text.dark.black,
  },
}));

export default Input;
