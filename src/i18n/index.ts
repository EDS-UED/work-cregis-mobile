import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { enUS } from './locales/en-US';
import { zhCN } from './locales/zh-CN';
import { zhTW } from './locales/zh-TW';

void i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': { translation: zhCN },
    'en-US': { translation: enUS },
    'zh-TW': { translation: zhTW },
  },
  lng: 'zh-CN',
  fallbackLng: 'en-US',
  interpolation: { escapeValue: false },
});

export default i18n;
