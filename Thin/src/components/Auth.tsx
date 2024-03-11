import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  ImageBackground,
  Alert,
  StatusBar,
  Image,
  Text,
} from 'react-native';
import BootSplash from 'react-native-bootsplash';
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

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const webClientId =
  '130248553868-cprpo4t6s3sj2nq9lb8ggo97cpk9905l.apps.googleusercontent.com';

const AuthScreen = ({ children }: PropsWithChildren) => {
  const styles = useStyles();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = async () => {
    await GoogleSignin.configure({
      webClientId: webClientId,
    });
  };

  const fetchUserLoginToken = async (idToken: string) => {
    try {
      const res = await request<{ token: string }>({
        method: 'post',
        url: '/login',
        data: { token: idToken },
      });
      if (!res?.token) throw new Error('No token found');
      // Call onSuccess callback with the token
      setIsSignedIn(true); // Store token in AsyncStorage
      await AsyncStorageUtils.setItem(config.tokenStorageKey, res.token);
    } catch (error) {
      await AsyncStorageUtils.clearAll();
      setIsSignedIn(false);
      Alert.prompt('Error logging in');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    setIsLoading(true);
    try {
      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      // Fetch user token from Firebase
      if (!userInfo.idToken) throw new Error('Error logging in');
      await fetchUserLoginToken(userInfo.idToken);
    } catch (error: any) {
      setIsSignedIn(false);
      Alert.prompt('Error authenticating with Google');
      console.log(error);
    } finally {
      await BootSplash.hide({ fade: true });
    }
  };

  useEffect(() => {
    async function login() {
      googleLogin();
      setIsSignedIn(await GoogleSignin.isSignedIn());
    }
    login();
  }, []);

  if (isSignedIn) {
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
            <Text style={styles.headerText}>Thin</Text>
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
  headerText: {
    color: 'white',
    textAlign: 'left',
    fontWeight: '700',
    fontSize: 29,
    marginTop: 10,
  },
  heroText: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 10,
    fontSize: s(theme.fontSizes.lg),
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
    marginBottom: 30,
  },
  footerContainer: {
    padding: s(30),
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.lightBlue[600],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: vs(200), // Adjust height as needed
  },
}));

export default AuthScreen;
