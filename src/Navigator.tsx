import { LinkingOptions, RouteProp } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { PropsWithChildren } from 'react';
import Home from './Screens/Home';
import AddStoryScreen from './Screens/AddStory';
import Header from './components/Header';
import { AppBarProvider, useAppBar } from './context/AppBarProvider';
import ProfileScreen from './Screens/Profile';
import IntroductionScreen from './Screens/Introduction/index';
import AuthorSignupScreen from './Screens/AuthorSignup';
import { useAuth } from './context/AuthProvider';
import NewsItemScreen from './Screens/NewsItem';
import GenericAppbar from './components/GenericAppbar';

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
    >
  >();

export const linking: LinkingOptions<ScreensParamsList> = {
  prefixes: ['com.thin://', 'https://thin.maarkar.in'],
  config: {
    screens: {
      PublicNewsItemScreen: {
        path: 'story',
        parse: {
          uuid: (uuid: string) => `${uuid}`, // ensuring uuid is treated as a string
        },
      },
    },
  },
};

export interface PageProps<T extends keyof ScreensParamsList> {
  // T is one of Home|PasswordAdd
  navigation: NativeStackNavigationProp<ScreensParamsList, T>;
  route: RouteProp<ScreensParamsList, T>;
}

function StackNavigator() {
  const appBarProps = useAppBar();
  const initialRouteName = 'Home';

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
        name="AddStory"
        component={AddStoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
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
        name="AuthorSignupScreen"
        component={AuthorSignupScreen}
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

export default function AppNavigator({
  children,
}: Readonly<Partial<PropsWithChildren>>) {
  return (
    <AppBarProvider>
      {children}
      <StackNavigator />
    </AppBarProvider>
  );
}
