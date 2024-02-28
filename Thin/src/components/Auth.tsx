import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Alert,
  StatusBar,
  Image,
  Text,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'; // Import Firebase authentication module
import AsyncStorageUtils from '../helpers/asyncStorage';
import { request } from '../axios';
import config from '../config/config';
import FullScreenLoader from './FullScreenLoader';
import AuthLoading from './AuthLoading';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const webClientId =
  '130248553868-cprpo4t6s3sj2nq9lb8ggo97cpk9905l.apps.googleusercontent.com';

const AuthScreen = ({ children }: PropsWithChildren) => {
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

      setIsSignedIn(true);
    } catch (error: any) {
      setIsLoading(false);
      Alert.prompt('Error authenticating with Google');
      console.log(error);
    }
  };

  useEffect(() => {
    async function login() {
      googleLogin();
      // setIsSignedIn(await GoogleSignin.isSignedIn());
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
              style={{ width: 60, height: 60, marginRight: 10 }}
            />
            <Text style={styles.headerText}>Thin</Text>
          </View>
          <View>
            <Text style={styles.heroText}>
              Stay Updated with Latest News and Blogs
            </Text>
            <Text style={styles.heroSub}>
              Explore curated content and stay informed about the latest news,
              insightful blogs, and developer updates, all in one place.
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

const styles = StyleSheet.create({
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
  },

  imageOverlap: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#030e19a4',
    flex: 1,
    width: '100%',
    padding: 20,
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
});

export default AuthScreen;
