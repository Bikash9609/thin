import { logAppLogout } from '@/analytics';
import config from '@/config/config';
import { useAuth } from '@/context/AuthProvider';
import { ScreenProps } from '@/Navigator';
import { openLink } from '@/utils';
import { fs } from '@/utils/font';
import { makeStyles } from '@rneui/themed';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomListItem = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => {
  const styles = useStyles();
  return (
    <Pressable onPress={onPress} style={styles.listItem}>
      <Text style={styles.listItemText}>{title}</Text>
    </Pressable>
  );
};

const SettingsScreen = ({ navigation }: ScreenProps<'Settings'>) => {
  const styles = useStyles();
  const { logout, user } = useAuth();

  const sendEmail = async () => {
    const subject = 'Frulow App Feedback';
    const body = `Hi Frulow Team`;
    const url = `mailto:support@maarkar.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    openLink(url)();
  };

  const handleLogout = async () => {
    logAppLogout(`${user?.user?.id}` ?? undefined);
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerIconContainer}>
          <Ionicons
            name="arrow-back-outline"
            size={scale(24)}
            color="black"
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Home')}
          />
        </View>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <Text style={styles.email}>{user?.user?.email}</Text>

      <CustomListItem title="Terms" onPress={openLink(config.terms)} />
      <CustomListItem title="Privacy" onPress={openLink(config.privacy)} />
      <CustomListItem
        title="User guidelines"
        onPress={openLink(config.guidelines)}
      />
      <CustomListItem title="Send Feedback" onPress={sendEmail} />

      <Pressable onPress={handleLogout}>
        <View style={styles.footerBtn}>
          <Text style={styles.footerBtnTitle}>Logout</Text>
        </View>
      </Pressable>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: scale(20),
    backgroundColor: theme.colors.white,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(15),
    paddingHorizontal: scale(10),
    gap: scale(10),
  },
  headerIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    backgroundColor: theme.colors.blue[600],
    color: theme.text.light.white,
    borderRadius: theme.borderRadius.xxl,
    padding: scale(theme.spacing.sm),
    height: scale(40),
    width: scale(40),
  },
  headerText: {
    textAlign: 'center',
    color: theme.text.dark.black,
    fontSize: scale(theme.fontSizes.xxl),
    ...theme.fontWeights.bold,
  },

  email: {
    color: theme.colors.gray[500],
    fontSize: fs(theme.fontSizes.base),
    textAlign: 'left',
    paddingVertical: scale(15),
    paddingHorizontal: scale(10),
    ...theme.fontWeights.medium,
  },
  listItem: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border.color.lightGray,
    alignItems: 'flex-start',
  },
  listItemText: {
    color: theme.text.dark.black,
    fontSize: fs(16),
    ...theme.fontWeights.medium,
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.red[600],
    padding: 10,
    borderRadius: 5,
    height: scale(45),
    width: scale(310),
    marginTop: scale(20),
  },
  footerBtnTitle: {
    color: theme.colors.white,
    fontSize: fs(theme.fontSizes.base),
    textAlign: 'center',
    ...theme.fontWeights.medium,
  },
}));

export default SettingsScreen;
