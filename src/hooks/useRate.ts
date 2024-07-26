import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openLink } from '@/utils';
import { logAppRated, logAppRateDismissed } from '@/analytics';

const LAST_PROMPT_DATE_KEY = 'LAST_PROMPT_DATE';
const USER_CANCELLED_KEY = 'USER_CANCELLED';
const USER_RATED_KEY = 'USER_RATED';
const DAILY_PROMPT_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CANCELLED_PROMPT_INTERVAL = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

interface UseRatePromptReturn {
  showPrompt: boolean;
  onClose: () => void;
  onRate: () => void;
}

const useRatePrompt = (): UseRatePromptReturn => {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  const checkAndShowPrompt = useCallback(async () => {
    try {
      const lastPromptDate = await AsyncStorage.getItem(LAST_PROMPT_DATE_KEY);
      const userCancelled = await AsyncStorage.getItem(USER_CANCELLED_KEY);
      const userRated = await AsyncStorage.getItem(USER_RATED_KEY);

      if (userRated) {
        // If user has rated, do not show the prompt
        setShowPrompt(false);
        return;
      }

      const now = new Date().getTime();
      const shouldPromptDaily =
        !userCancelled &&
        (!lastPromptDate ||
          now - new Date(lastPromptDate).getTime() > DAILY_PROMPT_INTERVAL);
      const shouldPromptEvery5Days =
        userCancelled &&
        (!lastPromptDate ||
          now - new Date(lastPromptDate).getTime() > CANCELLED_PROMPT_INTERVAL);

      if (shouldPromptDaily || shouldPromptEvery5Days) {
        setShowPrompt(true);
      } else {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Error checking rate prompt:', error);
    }
  }, []);

  const handlePromptResponse = async (rated: boolean) => {
    try {
      await AsyncStorage.setItem(
        LAST_PROMPT_DATE_KEY,
        new Date().toISOString(),
      );

      if (rated) {
        await AsyncStorage.setItem(USER_RATED_KEY, 'true');
        await AsyncStorage.removeItem(USER_CANCELLED_KEY);
        logAppRated();
      } else {
        await AsyncStorage.setItem(USER_CANCELLED_KEY, 'true');
        logAppRateDismissed();
      }

      setShowPrompt(false);
    } catch (error) {
      console.error('Error handling prompt response:', error);
    }
  };

  useEffect(() => {
    checkAndShowPrompt();
  }, [checkAndShowPrompt]);

  const onRate = () => {
    // Handle rating action, e.g., open app store page
    handlePromptResponse(true);
    openLink('https://play.google.com/store/apps/details?id=com.thin')();
  };

  const onClose = () => {
    handlePromptResponse(false);
  };

  return {
    showPrompt,
    onClose,
    onRate,
  };
};

export default useRatePrompt;
