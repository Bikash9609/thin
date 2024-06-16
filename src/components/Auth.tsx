import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  View,
  Dimensions,
  ImageBackground,
  Alert,
  StatusBar,
  Image,
  Text,
  Linking,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import AsyncStorageUtils from '../helpers/asyncStorage';
import { request } from '../axios';
import config from '../config/config';
import AuthLoading from './AuthLoading';
import { s, vs } from 'react-native-size-matters';
import { makeStyles } from '@rneui/themed';
import { useAuth } from '../context/AuthProvider';
import Snackbar from 'react-native-snackbar';
import { fs } from '../utils/font';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const webClientId =
  '130248553868-cprpo4t6s3sj2nq9lb8ggo97cpk9905l.apps.googleusercontent.com';

const AuthScreen = ({ children }: PropsWithChildren) => {
  const styles = useStyles();
  const { login, logout, isAuthenticated, user } = useAuth();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const configureGoogleSignIn = async () => {
    await GoogleSignin.configure({
      webClientId: webClientId,
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const fetchUserLoginToken = async (idToken: string) => {
    try {
      const res = await request<{ token: string; user: User }>({
        method: 'post',
        url: '/login',
        data: { token: idToken },
      });
      if (!res?.token) throw new Error('No token found');
      // Call onSuccess callback with the token
      setIsSignedIn(true); // Store token in AsyncStorage
      await AsyncStorageUtils.setItem(config.tokenStorageKey, res.token);
      return res;
    } catch (error) {
      console.log(error);
      await AsyncStorageUtils.clearAll();
      setIsSignedIn(false);
      Alert.prompt('Error logging in');
      throw error;
    }
  };

  const googleLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsSignedIn(await GoogleSignin.hasPreviousSignIn());
      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      // Fetch user token from Firebase
      if (!userInfo?.idToken) throw new Error('Error logging in');
      const res = await fetchUserLoginToken(userInfo.idToken);
      login(res);
    } catch (error: any) {
      logout();
      setIsSignedIn(false);
      Alert.prompt('Error authenticating with Google');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [login, logout]);

  const googleLoginSilent = useCallback(async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      if (!userInfo?.idToken) throw new Error('Error logging in');
      const res = await fetchUserLoginToken(userInfo.idToken);
      login(res);
    } catch (error: any) {
      logout();
      setIsSignedIn(false);
      Snackbar.show({
        text: 'Error logging in, please login manually to view account!',
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [login, logout]);

  const fetchUserExistence = useCallback(async () => {
    const session = await AsyncStorageUtils.getItem(config.tokenStorageKey);
    if (session) {
      setIsLoading(true);
      login(session);
      setIsSignedIn(true);
      googleLoginSilent();
    } else {
      setTimeout(() => {
        googleLogin();
      }, 6000);
    }
  }, [googleLogin, googleLoginSilent, login]);

  useEffect(() => {
    fetchUserExistence();
  }, []);

  useEffect(() => {
    if (!user && !isLoading && isSignedIn && !isAuthenticated()) {
      setIsSignedIn(false);
    }
  }, [user, isLoading, isSignedIn, isAuthenticated]);

  if (isSignedIn && isAuthenticated()) {
    return children;
  }

  if (isLoading) {
    return <AuthLoading />;
  }

  return (
    <View style={styles.container}>
      <StatusBar animated backgroundColor="#030e19" barStyle="dark-content" />
      <ImageBackground
        source={require('../assets/1.jpeg')}
        style={styles.imageBackground}>
        <View style={styles.imageOverlap}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/icon.png')}
              resizeMode="contain"
              style={{ width: s(100), height: s(100), marginRight: 10 }}
            />
          </View>
          <View style={styles.footerContainer}>
            <Text style={styles.heroText}>Rapid News & Blogs</Text>
            <Text style={styles.heroSub}>
              Discover news, blogs, and developer updates, all curated in one
              place.
            </Text>
            <GoogleSigninButton
              style={styles.googleButton}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={googleLogin}
              disabled={isLoading}
            />
            <Text style={styles.reminderTerms}>
              *By signing in you accept Thin{' '}
              <Text style={styles.link} onPress={() => openLink(config.terms)}>
                terms
              </Text>
              ,{' '}
              <Text
                style={styles.link}
                onPress={() => openLink(config.privacy)}>
                privacy
              </Text>
              , &{' '}
              <Text
                style={styles.link}
                onPress={() => openLink(config.guidelines)}>
                user guidelines
              </Text>
              .
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#002633',
    position: 'relative',
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  logoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(200),
  },
  imageOverlap: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  heroText: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 10,
    fontSize: fs(theme.fontSizes.lg),
    ...theme.fontWeights.extraBold,
  },
  heroSub: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  googleButton: {
    width: screenWidth - 100, // Google button width
    height: 48, // Google button height
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: s(5),
  },
  footerContainer: {
    padding: s(30),
    paddingBottom: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.darkBlue[800],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: vs(250), // Adjust height as needed
  },
  reminderTerms: {
    textAlign: 'center',
    color: 'white',
    fontSize: fs(theme.fontSizes.xs - 3),
    ...theme.fontWeights.medium,
  },
  link: {
    color: theme.colors.blue[50], // Or any color you want for the links
    textDecorationLine: 'underline',
    fontSize: fs(theme.fontSizes.xs - 3),
    ...theme.fontWeights.medium,
  },
}));

export default AuthScreen;
