import { useCallback } from 'react';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { EgEdsAnimaPage, shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import type { HomeStackParamList } from '@/navigation/types';
import { findAnnouncement } from '@/scenes/messages/announcements';
import { edsPageBackground } from '@/utils/edsTheme';

import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';

type ScreenOptionsProps = Parameters<ReturnType<typeof EgEdsAnimaPage>>[0];

function titleForLanguage(
  title: { 'zh-CN': string; 'en-US': string; 'zh-TW': string },
  language: string,
): string {
  if (language === 'en-US' || language.startsWith('en')) {
    return title['en-US'];
  }
  if (language === 'zh-TW' || language === 'zh-Hant' || language.startsWith('zh-TW')) {
    return title['zh-TW'];
  }
  return title['zh-CN'];
}

/** 公告正文页 · 顶栏不重复标题，正文自带标题。 */
export function useAnnouncementDetailScreenOptions() {
  const { colors, mode } = useEdsTheme();
  const { i18n } = useTranslation();
  const pageBackground = edsPageBackground(colors);

  return useCallback(
    (
      props: ScreenOptionsProps & {
        route: RouteProp<HomeStackParamList, 'MessagesAnnouncement'>;
      },
    ): StackNavigationOptions => {
      const article = findAnnouncement(props.route.params.id);
      const title = article ? titleForLanguage(article.title, i18n.language) : ' ';

      if (shouldUseEgEdsAnimaNativePage()) {
        const base = EgEdsAnimaPage({ mode })(props) as StackNavigationOptions;
        return {
          ...base,
          title,
          contentStyle: { backgroundColor: pageBackground },
        } as StackNavigationOptions;
      }

      return {
        title,
        ...edsPagePushedScreenOptions,
        cardStyle: { backgroundColor: pageBackground, overflow: 'visible' },
      };
    },
    [i18n.language, mode, pageBackground],
  );
}
