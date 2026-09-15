import type { ZhCNMessages } from './zh-CN';

export const zhTW: {
  [K in keyof ZhCNMessages]: {
    [P in keyof ZhCNMessages[K]]: string;
  };
} = {
  app: {
    name: 'cregis',
  },
  tabs: {
    home: '主頁',
    collaboration: '協作',
    assets: '資產',
    waas: 'WaaS項目',
    my: '我的',
  },
  scenes: {
    homeTitle: '主頁',
    homeSubtitle: '資產與待辦概覽（Mock）',
    collaborationTitle: '協作',
    collaborationSubtitle: '審批與簽名任務（Mock）',
    assetsTitle: '資產',
    assetsSubtitle: '賬戶資產總覽（Mock）',
    waasTitle: 'WaaS項目',
    waasSubtitle: '項目管理（Mock）',
    profileTitle: '我的',
    profileSubtitle: '賬號與偏好設置',
    detailTitle: '詳情',
  },
  profile: {
    theme: '主題',
    themeLight: '淺色',
    themeDark: '深色',
    themeSystem: '跟隨系統',
    locale: '語言',
    biometrics: '生物識別',
    biometricsMock: '模擬驗證',
    signIn: 'Mock 登入',
    signOut: '退出登入',
  },
  waas: {
    empty: '暫無項目',
    create: '創建項目',
    projectName: '項目名稱',
    submit: '提交',
    cancel: '取消',
  },
  preview: {
    preview: 'Preview',
    inspect: 'Inspect',
  },
};
