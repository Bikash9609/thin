// NavigationTypes.ts
type ScreensParamsList = {
  Home: undefined;
  AddStory: undefined;
  ProfileScreen: undefined;
  IntroductionScreen: undefined;
  AuthorSignupScreen: undefined;
  NewsItemScreen: { uuid: string };
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
};
