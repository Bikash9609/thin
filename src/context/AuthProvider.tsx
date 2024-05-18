import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
  SetStateAction,
} from 'react';

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
  logout: () => void;
  isAuthenticated: () => boolean;
  getUserInfo: () => User | undefined;
  setData: (x: UserStored) => any;
}

// Create the authentication context with initial values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
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
  const logout = () => {
    setData(null);
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
