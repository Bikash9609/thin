import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

// Define the shape of your context
interface AppBarContextType {
  isAppBarVisible: boolean;
  toggleAppBarVisibility: () => void;
}

// Create the context with initial values
const AppBarContext = createContext<AppBarContextType>({
  isAppBarVisible: false, // Default value
  toggleAppBarVisibility: () => {}, // Default function
});

// Custom hook to access the context
export const useAppBar = () => useContext(AppBarContext);

// Provider component to wrap your application
export const AppBarProvider = ({ children }: PropsWithChildren) => {
  // State to manage the visibility of the appbar
  const [isAppBarVisible, setIsAppBarVisible] = useState<boolean>(false);

  // Function to toggle the visibility of the appbar
  const toggleAppBarVisibility = () => {
    setIsAppBarVisible(prevState => !prevState);
  };

  // Value to be provided by the context
  const value: AppBarContextType = {
    isAppBarVisible,
    toggleAppBarVisibility,
  };

  return (
    <AppBarContext.Provider value={value}>{children}</AppBarContext.Provider>
  );
};
