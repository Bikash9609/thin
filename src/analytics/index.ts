import analytics from '@react-native-firebase/analytics';

// Define types for event parameters
interface AuthLoginErrorParams {
  error_message: string;
  login_type: string;
}

interface AuthLoginSuccessParams {
  user_id: string;
  login_type: string;
}

export async function logAuthLoginError(
  errorMessage: string,
  loginType: string,
): Promise<void> {
  try {
    await analytics().logEvent('auth_login_error', {
      error_message: errorMessage,
      login_type: loginType,
    } as AuthLoginErrorParams);
  } catch (error) {
    console.error('Failed to log authentication login error:', error);
  }
}

export async function logAuthLoginSuccess(
  userId: string,
  loginType: string,
): Promise<void> {
  try {
    await analytics().logEvent('auth_login_success', {
      user_id: userId,
      login_type: loginType,
    } as AuthLoginSuccessParams);
  } catch (error) {
    console.error('Failed to log authentication login success:', error);
  }
}

export async function setLogUserId(userId: string): Promise<void> {
  try {
    await analytics().setUserId(`${userId}`);
  } catch (error) {
    console.error('Failed to set user ID:', error);
  }
}

export async function logLoginTriggered(loginType: string): Promise<void> {
  try {
    await analytics().logLogin({ method: loginType });
  } catch (error) {
    console.error('Failed to log login triggered event:', error);
  }
}

export async function logCardViewed(
  cardId: string,
  cardType?: string,
): Promise<void> {
  try {
    await analytics().logEvent('card_viewed', {
      card_id: cardId,
      card_type: cardType || 'unknown',
    });
  } catch (error) {
    console.error('Failed to log card viewed event:', error);
  }
}

export async function logAppRated(): Promise<void> {
  try {
    await analytics().logEvent('app_rated');
  } catch (error) {
    console.error('Failed to log rating prompt triggered event:', error);
  }
}

export async function logAppRateDismissed(): Promise<void> {
  try {
    await analytics().logEvent('app_rate_dismissed');
  } catch (error) {
    console.error('Failed to log rating prompt closed event:', error);
  }
}

export async function logAppLogout(userId?: string): Promise<void> {
  try {
    await analytics().logEvent('app_logout', {
      user_id: userId,
    });
  } catch (error) {
    console.error('Failed to log app logout event:', error);
  }
}

export async function logFcmToken(): Promise<void> {
  try {
    await analytics().logEvent('fcm_token_fired');
  } catch (error) {
    console.error('Failed to log app logout event:', error);
  }
}

export async function logNotificationPermissionRejected(): Promise<void> {
  try {
    await analytics().logEvent('notification_rejected');
  } catch (error) {
    console.error('Failed to log app logout event:', error);
  }
}
