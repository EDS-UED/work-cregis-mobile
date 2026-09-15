import type { ZhCNMessages } from './zh-CN';

export const enUS: {
  [K in keyof ZhCNMessages]: {
    [P in keyof ZhCNMessages[K]]: string;
  };
} = {
  app: {
    name: 'cregis',
  },
  tabs: {
    home: 'Home',
    collaboration: 'Collaboration',
    assets: 'Assets',
    waas: 'WaaS',
    my: 'Profile',
  },
  scenes: {
    homeTitle: 'Home',
    homeSubtitle: 'Portfolio and task overview (Mock)',
    collaborationTitle: 'Collaboration',
    collaborationSubtitle: 'Approval and signing tasks (Mock)',
    assetsTitle: 'Assets',
    assetsSubtitle: 'Account asset overview (Mock)',
    waasTitle: 'WaaS Projects',
    waasSubtitle: 'Project management (Mock)',
    profileTitle: 'Profile',
    profileSubtitle: 'Account and preferences',
    detailTitle: 'Detail',
  },
  profile: {
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    locale: 'Language',
    biometrics: 'Biometrics',
    biometricsMock: 'Mock authenticate',
    signIn: 'Mock sign in',
    signOut: 'Sign out',
  },
  waas: {
    empty: 'No projects yet',
    create: 'Create project',
    projectName: 'Project name',
    submit: 'Submit',
    cancel: 'Cancel',
  },
  preview: {
    preview: 'Preview',
    inspect: 'Inspect',
  },
};
