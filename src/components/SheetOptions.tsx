import React from 'react';
import {
  BottomSheet,
  Icon,
  ListItem,
  makeStyles,
  useTheme,
} from '@rneui/themed';
import { s } from 'react-native-size-matters';
import { fs } from '../utils/font';

const useStyles = makeStyles(theme => ({
  root: {},
  listItem: {
    backgroundColor: theme.colors.coolGray[50],
  },
  listItemTitle: {
    color: theme.text.dark.black,
    fontSize: fs(theme.fontSizes.sm),
    ...theme.fontWeights.semiBold,
  },
}));

export type Option = {
  id: number;
  label: string;
  icon?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOptionPress: (res: Option) => void;
  options: Option[];
};

const SheetOptions = ({ isOpen, onClose, onOptionPress, options }: Props) => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <BottomSheet
      containerStyle={styles.root}
      modalProps={{}}
      onBackdropPress={onClose}
      isVisible={isOpen}>
      {options.map(option => (
        <ListItem
          key={option.id}
          containerStyle={styles.listItem}
          onPress={() => onOptionPress(option)}>
          {option.icon && (
            <Icon
              name={option.icon}
              type="ionicon"
              color={theme.text.dark.black}
              size={fs(18)}
            />
          )}
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>
              {option.label}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );
};

export default SheetOptions;
