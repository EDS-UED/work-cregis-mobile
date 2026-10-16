import type { ZhCNMessages } from './zh-CN';

export const enUS: {
  [K in keyof ZhCNMessages]: {
    [P in keyof ZhCNMessages[K]]: string;
  };
} = {
  common: {
    back: 'Back',
  },
  app: {
    name: 'cregis',
  },
  tabs: {
    home: 'Home',
    wallet: 'Wallet',
    collaboration: 'Collaboration',
    transactionRecords: 'Transactions',
  },
  home: {
    estTotalValue: 'Total assets (est.)',
    send: 'Send',
    receive: 'Receive',
    whitelist: 'Whitelist',
    more: 'More',
    collapse: 'Collapse',
    customize: 'Customize',
    todoTitle: 'Pending tasks',
    filterApproval: 'Pending approval',
    filterSign: 'Pending signature',
    filterErrorCallback: 'Exception callbacks',
    hideBalance: 'Hide balance',
    showBalance: 'Show balance',
    notifications: 'Notifications',
    scan: 'Scan QR code',
    userAvatar: 'User {{name}}',
  },
  scenes: {
    homeTitle: 'Home',
    homeSubtitle: 'Portfolio and task overview (Mock)',
    collaborationTitle: 'Collaboration',
    collaborationSubtitle: 'Approval and signing tasks (Mock)',
    assetsTitle: 'Wallet',
    assetsSubtitle: 'Account asset overview (Mock)',
    assetsTotalLabel: 'Total overview',
    collaborationMockApproval: 'Approval {{id}}',
    collaborationMockSigning: 'Signing {{id}}',
    collaborationStatusPending: 'Pending',
    collaborationStatusApproved: 'Approved',
    collaborationStatusRejected: 'Rejected',
    transactionRecordsTitle: 'Transactions',
    transactionRecordsSubtitle: 'Transaction history (Mock)',
    detailTitle: 'Detail',
    homePendingTasks: '{{count}} pending tasks',
    detailMock: 'Mock detail content',
  },
};
