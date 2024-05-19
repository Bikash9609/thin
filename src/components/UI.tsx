import { makeStyles } from '@rneui/themed';
import React from 'react';
import { Pressable, StyleProp, Text, View } from 'react-native';
import { s } from 'react-native-size-matters';

interface Props {
  disabled?: boolean;
  onPress?: () => void;
  title: string;
  style?: StyleProp<any>;
}

function Button({ disabled, onPress, title, style }: Props) {
  const styles = useStyles();
  return (
    <Pressable disabled={disabled} onPress={onPress}>
      <View style={[styles.footerBtn, style]}>
        <Text style={styles.footerBtnTitle}>{title}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

const useStyles = makeStyles(theme => ({
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.main[600],
    padding: s(theme.spacing.sm),
    borderRadius: s(theme.borderRadius.md),
    height: s(40),
  },
  footerBtnTitle: {
    color: theme.text.light.white,
    marginLeft: s(3),
    fontSize: s(theme.fontSizes.base - 3),
    ...theme.fontWeights.bold,
  },
}));
