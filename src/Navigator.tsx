import { LinkingOptions, RouteProp } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { PropsWithChildren } from 'react';
import Home from './Screens/Home';
import Header from './components/Header';
import { AppBarProvider, useAppBar } from './context/AppBarProvider';
import IntroductionScreen from './Screens/Introduction/index';
import NewsItemScreen from './Screens/NewsItem';
import GenericAppbar from './components/GenericAppbar';
import { Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { convertToNestedObject } from './helpers/objects';
import { useAuth } from './context/AuthProvider';
import AuthScreen from './Screens/Auth';
import SettingsScreen from './Screens/Settings';

const Stack =
  createNativeStackNavigator<
    Pick<
      ScreensParamsList,
      | 'Home'
      | 'AddStory'
      | 'ProfileScreen'
      | 'IntroductionScreen'
      | 'AuthorSignupScreen'
      | 'NewsItemScreen'
      | 'PublicNewsItemScreen'
      | 'Auth'
      | 'Settings'
    >
  >();

export interface ScreenProps<T extends keyof ScreensParamsList> {
  // T is one of Home|PasswordAdd
  navigation: NativeStackNavigationProp<ScreensParamsList, T>;
}

const NAVIGATION_IDS = ['PublicNewsItemScreen'];

function buildDeepLinkFromNotificationData(_data: any): string | null {
  if (!_data) return null;

  const data = convertToNestedObject(_data) as { screen: string; params: any };
  const navigationId = data?.screen;
  if (!navigationId || !NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId);
    return null;
  }
  if (navigationId === 'PublicNewsItemScreen') {
    return `thin://story/${data.params.postId}`;
  }
  return null;
}

export const linking: LinkingOptions<ScreensParamsList> = {
  prefixes: ['thin://', 'https://thin.maarkar.in'],
  config: {
    screens: {
      PublicNewsItemScreen: 'story/:uuid',
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    //getInitialNotification: When the application is opened from a quit state.
    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },
  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

    //onNotificationOpenedApp: When the application is running, but in the background.
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data);
      if (typeof url === 'string') {
        listener(url);
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
    };
  },
};

export interface PageProps<T extends keyof ScreensParamsList> {
  // T is one of Home|PasswordAdd
  navigation: NativeStackNavigationProp<ScreensParamsList, T>;
  route: RouteProp<ScreensParamsList, T>;
}

function StackNavigator() {
  const appBarProps = useAppBar();
  const initialRouteName = 'Settings';

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          header: () => <Header fixed {...appBarProps} />,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          header: () => <Header fixed {...appBarProps} />,
        }}
      />

      <Stack.Screen
        name="IntroductionScreen"
        component={IntroductionScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NewsItemScreen"
        component={NewsItemScreen}
        options={{
          headerBackVisible: true,
          headerShown: true,
          header: ({ navigation: { canGoBack, goBack, navigate } }) => (
            <GenericAppbar
              height="sm"
              title="Dashboard"
              onBackPress={() =>
                canGoBack() ? goBack() : navigate('ProfileScreen')
              }
            />
          ),
        }}
      />
      <Stack.Screen
        name="PublicNewsItemScreen"
        component={NewsItemScreen}
        options={{
          headerBackVisible: true,
          headerShown: true,
          header: ({ navigation: { canGoBack, goBack, navigate } }) => (
            <GenericAppbar
              height="sm"
              title="Home"
              onBackPress={() => (canGoBack() ? goBack() : navigate('Home'))}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function AuthStackNavigator() {
  const appBarProps = useAppBar();

  return (
    <Stack.Navigator initialRouteName={'Auth'}>
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator({
  children,
}: Readonly<Partial<PropsWithChildren>>) {
  const { isAuthenticated } = useAuth();
  return (
    <AppBarProvider>
      {children}
      {isAuthenticated() ? <StackNavigator /> : <AuthStackNavigator />}
    </AppBarProvider>
  );
}
