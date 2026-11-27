import type { MessageCategory } from '@/scenes/messages/messagesMock';
import type { TeamCenterDetailId } from '@/scenes/team/teamCenterDetail';
import type { TabRouteName } from '@/types/app';

export type RootTabParamList = {
  Home: undefined;
  Wallet: undefined;
  Collaboration: undefined;
  TransactionRecords: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  AssetDistribution: undefined;
  PersonalCenter: undefined;
  ProfileEdit: undefined;
  IdentityVerification: undefined;
  AccountEmail: undefined;
  ResetAccountEmail: undefined;
  GoogleAuthenticator: undefined;
  SetTransactionPassword: undefined;
  LoginDevices: undefined;
  MpcNetworkSettings: undefined;
  About: undefined;
  TeamCenter: undefined;
  TeamCenterDetail: { id: TeamCenterDetailId };
  Messages: undefined;
  MessagesCategory: { category: MessageCategory };
  MessagesAnnouncement: { id: string };
  Scan: undefined;
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
  CompareTeamCenterCardTraditional: undefined;
  CompareTeamCenterCardGray: undefined;
  CompareHomeTodoCard: undefined;
  CompareHomeTodoDivider: undefined;
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
