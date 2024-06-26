import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { View, Text } from 'react-native';
import { s } from 'react-native-size-matters';
import { BannerAdUnit } from '../../components/AdUnit';
import Icon from 'react-native-vector-icons/Ionicons';
import AppbarWithAvatar from '../../components/AppbarWithAvatar';

interface Props {}

const AdUnit: React.FC<Props> = () => {
  const { theme } = useTheme();
  const styles = useStyles();

  return (
    <View style={[styles.container]}>
      <AppbarWithAvatar />
      <View style={styles.row}>
        <Icon
          name="information-circle-outline"
          size={s(13)}
          color={theme.text.dark.dimGray}
        />
        <Text style={styles.title}>Sponsored</Text>
      </View>

      <BannerAdUnit />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: s(20),
  },

  title: {
    textAlign: 'center',
    lineHeight: s(16),
    marginLeft: 2,
    fontSize: s(theme.fontSizes.xs),
    color: theme.text.dark.dimGray,
    ...theme.fontWeights.normal,
  },
}));

export default AdUnit;
