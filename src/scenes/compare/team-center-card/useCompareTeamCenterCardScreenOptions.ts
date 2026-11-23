import { useCallback } from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { EgEdsAnimaPage, shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import type { CompareTeamCenterCardVariant } from '@/scenes/compare/team-center-card/compareTeamCenterCardVariant';
import { edsPageBackground, edsPageCardBackground } from '@/utils/edsTheme';

import { egNavBarNativeStackClearHeaderItems } from '@/navigation/screenOptions/egNavBarNativeStackClearHeaderItems';
import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';

type ScreenOptionsProps = Parameters<ReturnType<typeof EgEdsAnimaPage>>[0];

const TITLE_KEY: Record<
  CompareTeamCenterCardVariant,
  'compare.teamCenterCardTraditionalTitle' | 'compare.teamCenterCardGrayTitle'
> = {
  traditional: 'compare.teamCenterCardTraditionalTitle',
  gray: 'compare.teamCenterCardGrayTitle',
};

/** 对比 · 团队中心-卡片 — 与 `SceneScaffold` 底纹一致（`SceneScaffold` 顶栏）。 */
export function useCompareTeamCenterCardScreenOptions(
  variant: CompareTeamCenterCardVariant,
) {
  const { t } = useTranslation();
  const { colors, mode } = useEdsTheme();
  const pageBackground =
    variant === 'gray'
      ? edsPageBackground(colors)
      : edsPageCardBackground(colors);
  const title = t(TITLE_KEY[variant]);

  return useCallback(
    (props: ScreenOptionsProps): StackNavigationOptions => {
      const base = EgEdsAnimaPage({ direction: 'horizontal-reverse', mode })(
        props,
      ) as StackNavigationOptions & NativeStackNavigationOptions;

      if (shouldUseEgEdsAnimaNativePage()) {
        return {
          ...base,
          title,
          ...egNavBarNativeStackClearHeaderItems(),
          contentStyle: { backgroundColor: pageBackground },
        } as StackNavigationOptions;
      }

      return {
        ...base,
        title,
        ...edsPagePushedScreenOptions,
        cardStyle: { backgroundColor: pageBackground, overflow: 'visible' },
      };
    },
    [mode, pageBackground, title, variant],
  );
}