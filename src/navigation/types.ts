import type { TabRouteName } from '@/types/app';

export type RootTabParamList = {
  Home: undefined;
  Collaboration: undefined;
  Assets: undefined;
  Waas: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
};

export type CollaborationStackParamList = {
  CollaborationList: undefined;
  CollaborationDetail: { id: string; title: string };
};

export type AssetsStackParamList = {
  AssetsMain: undefined;
};

export type WaasStackParamList = {
  WaasMain: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
};

export const tabRouteNames: TabRouteName[] = [
  'Home',
  'Collaboration',
  'Assets',
  'Waas',
  'Profile',
];

export const tabI18nKeys: Record<TabRouteName, `tabs.${'home' | 'collaboration' | 'assets' | 'waas' | 'my'}`> =
  {
    Home: 'tabs.home',
    Collaboration: 'tabs.collaboration',
    Assets: 'tabs.assets',
    Waas: 'tabs.waas',
    Profile: 'tabs.my',
  };
