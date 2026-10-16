import type { ZhCNMessages } from './zh-CN';

export const zhTW: {
  [K in keyof ZhCNMessages]: {
    [P in keyof ZhCNMessages[K]]: string;
  };
} = {
  common: {
    back: '返回',
  },
  app: {
    name: 'cregis',
  },
  tabs: {
    home: '主頁',
    wallet: '錢包',
    collaboration: '協作',
    transactionRecords: '交易記錄',
  },
  home: {
    estTotalValue: '總資產折合',
    send: '發送',
    receive: '接收',
    whitelist: '白名單',
    more: '更多',
    collapse: '收起',
    customize: '自定義',
    todoTitle: '待辦任務',
    filterApproval: '待審批',
    filterSign: '待簽名',
    filterErrorCallback: '異常回調',
    hideBalance: '隱藏餘額',
    showBalance: '顯示餘額',
    notifications: '通知',
    scan: '掃碼',
    userAvatar: '用戶 {{name}}',
  },
  scenes: {
    homeTitle: '主頁',
    homeSubtitle: '資產與待辦概覽（Mock）',
    collaborationTitle: '協作',
    collaborationSubtitle: '審批與簽名任務（Mock）',
    assetsTitle: '錢包',
    assetsSubtitle: '賬戶資產總覽（Mock）',
    assetsTotalLabel: '資產總覽',
    collaborationMockApproval: '審批任務 {{id}}',
    collaborationMockSigning: '簽名任務 {{id}}',
    collaborationStatusPending: '待處理',
    collaborationStatusApproved: '已通過',
    collaborationStatusRejected: '已拒絕',
    transactionRecordsTitle: '交易記錄',
    transactionRecordsSubtitle: '交易流水（Mock）',
    detailTitle: '詳情',
    homePendingTasks: '待辦 {{count}} 項',
    detailMock: 'Mock 詳情內容',
  },
};
