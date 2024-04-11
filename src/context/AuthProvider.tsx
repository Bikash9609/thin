import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

// Define the shape of the user object
interface User {
  token: string;
  // Add more properties as needed
}

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

// Create the authentication context with initial values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: () => false,
});

// Custom hook to access the authentication context
export const useAuth = () => useContext(AuthContext);

// Create the AuthProvider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  // Function to handle user login
  const login = (userData: User) => {
    setUser(userData);
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = useCallback(() => !!(user && user.token), [user]);

  // Value to be provided by the context
  const authContextValue: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
