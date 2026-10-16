import type { TabRouteName } from '@/types/app';

export type RootTabParamList = {
  Home: undefined;
  Wallet: undefined;
  Collaboration: undefined;
  TransactionRecords: undefined;
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

export type TransactionRecordsStackParamList = {
  TransactionRecordsMain: undefined;
};

export const tabRouteNames: TabRouteName[] = ['Home', 'Wallet', 'Collaboration', 'TransactionRecords'];

export const tabI18nKeys: Record<
  TabRouteName,
  `tabs.${'home' | 'wallet' | 'collaboration' | 'transactionRecords'}`
> = {
  Home: 'tabs.home',
  Wallet: 'tabs.wallet',
  Collaboration: 'tabs.collaboration',
  TransactionRecords: 'tabs.transactionRecords',
};
