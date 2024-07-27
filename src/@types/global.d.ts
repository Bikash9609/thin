// NavigationTypes.ts
type ScreensParamsList = {
  Auth: undefined;
  Home: undefined;
  AddStory: undefined;
  ProfileScreen: undefined;
  IntroductionScreen: undefined;
  AuthorSignupScreen: undefined;
  NewsItemScreen: { uuid: string };
  PublicNewsItemScreen: { uuid: string };
  Settings: undefined;
};

type Author = {
  uuid: string;
  name: string;
  website: string;
  avatarUrl: string;
};

type User = {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  googleId: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author: Author;
  androidAppRated?: string;
};
