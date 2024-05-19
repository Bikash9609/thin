import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Alert } from 'react-native';

// Define the shape of the user object
export interface UserStored {
  token: string;
  user: User;
  // Add more properties as needed
}

// Define the shape of the authentication context
interface AuthContextType {
  user: UserStored | null;
  login: (userData: UserStored) => void;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  getUserInfo: () => User | undefined;
  setData: (x: UserStored) => any;
}

// Create the authentication context with initial values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: (() => {}) as unknown as any,
  isAuthenticated: () => false,
  getUserInfo: () => undefined,
  setData: () => undefined,
});

// Custom hook to access the authentication context
export const useAuth = () => useContext(AuthContext);

// Create the AuthProvider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState<UserStored | null>(null);

  // Function to handle user login
  const login = (userData: UserStored) => {
    setData(userData);
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.clear();
      await setData(null);
      setData(null);
    } catch (error) {
      Alert.alert(
        'Error logging out!',
        'Please try again. If the issue persists, try uninstalling and reinstalling the app.',
      );
    }
  };

  const isAuthenticated = useCallback(() => !!(data && data.token), [data]);

  const getUserInfo = useCallback(() => data?.user, [data]);

  // Value to be provided by the context
  const authContextValue: AuthContextType = {
    user: data,
    login,
    getUserInfo,
    logout,
    isAuthenticated,
    setData,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
