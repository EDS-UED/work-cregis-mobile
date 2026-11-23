import { useCallback, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import {
  EgEdsAnimaPageShot,
  type EgEdsAnimaPageShotRootApi,
  type EgEdsAnimaPageShotSource,
} from '@/eds/page-shot';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamPlanPageShotRoot } from '@/scenes/team/TeamPlanPageShotRoot';
import { TEAM_PLAN_PAGE_SHOT_ID } from '@/scenes/team/teamPlanPageShot';

/** 团队中心正文外 · page-shot 宿主（仅包住 Scroll 内区域，不包 Stack Nav）。 */
export function TeamCenterPageShotHost({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();
  const colors = useThemeColors();

  const renderRoot = useCallback(
    (api: EgEdsAnimaPageShotRootApi) => <TeamPlanPageShotRoot api={api} />,
    [],
  );

  const title = useCallback(
    (source: EgEdsAnimaPageShotSource, pageKey: string | null) =>
      pageKey === null && source.id === TEAM_PLAN_PAGE_SHOT_ID ? t('team.subscription') : undefined,
    [t],
  );

  const pageBackground = String(colors['box-page']);
  const planShotBackground = String(colors['material-card-moderate']);

  const background = useCallback(
    (source: EgEdsAnimaPageShotSource) =>
      source.id === TEAM_PLAN_PAGE_SHOT_ID ? planShotBackground : pageBackground,
    [pageBackground, planShotBackground],
  );

  return (
    <EgEdsAnimaPageShot
      mode={mode}
      title={title}
      background={background}
      scrollEdgeEffect="hidden"
      renderRoot={renderRoot}
    >
      {children}
    </EgEdsAnimaPageShot>
  );
}
