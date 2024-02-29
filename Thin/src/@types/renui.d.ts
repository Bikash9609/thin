import { AppTheme } from '../../AppThemeProvider';
import '@rneui/themed';

declare module '@rneui/themed' {
  type AppThemeType = typeof AppTheme;
  // Extend the Theme interface with your AppTheme structure
  export interface Theme extends AppThemeType {}
}
