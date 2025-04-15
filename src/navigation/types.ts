import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Feed: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  PostDetail: { postId: string };
  UserProfile: { userId: string };
  Notifications: undefined;
  Settings: undefined;
  About: undefined;
};
