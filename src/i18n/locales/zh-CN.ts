export const zhCN = {
  app: {
    name: 'cregis',
  },
  tabs: {
    home: '主页',
    collaboration: '协作',
    assets: '资产',
    waas: 'WaaS项目',
    my: '我的',
  },
  scenes: {
    homeTitle: '主页',
    homeSubtitle: '资产与待办概览（Mock）',
    collaborationTitle: '协作',
    collaborationSubtitle: '审批与签名任务（Mock）',
    assetsTitle: '资产',
    assetsSubtitle: '账户资产总览（Mock）',
    waasTitle: 'WaaS项目',
    waasSubtitle: '项目管理（Mock）',
    profileTitle: '我的',
    profileSubtitle: '账号与偏好设置',
    detailTitle: '详情',
  },
  profile: {
    theme: '主题',
    themeLight: '浅色',
    themeDark: '深色',
    themeSystem: '跟随系统',
    locale: '语言',
    biometrics: '生物识别',
    biometricsMock: '模拟验证',
    signIn: 'Mock 登录',
    signOut: '退出登录',
  },
  waas: {
    empty: '暂无项目',
    create: '创建项目',
    projectName: '项目名称',
    submit: '提交',
    cancel: '取消',
  },
  preview: {
    preview: 'Preview',
    inspect: 'Inspect',
  },
} as const;

export type ZhCNMessages = typeof zhCN;
