import { useCallback, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import {
  EgEdsAnimaPageShot,
  type EgEdsAnimaPageShotRootApi,
  type EgEdsAnimaPageShotSource,
} from '@/eds/page-shot';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamPlanPageShotRoot } from '@/scenes/team/TeamPlanPageShotRoot';
import { TEAM_PLAN_PAGE_SHOT_ID } from '@/scenes/team/teamPlanPageShot';

/** 团队中心正文外 · page-shot 宿主（仅包住 Scroll 内区域，不包 Stack Nav）。 */
export function TeamCenterPageShotHost({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();

  const renderRoot = useCallback(
    (api: EgEdsAnimaPageShotRootApi) => <TeamPlanPageShotRoot api={api} />,
    [],
  );

  const title = useCallback(
    (source: EgEdsAnimaPageShotSource, pageKey: string | null) =>
      pageKey === null && source.id === TEAM_PLAN_PAGE_SHOT_ID ? t('team.subscription') : undefined,
    [t],
  );

  return (
    <EgEdsAnimaPageShot mode={mode} title={title} renderRoot={renderRoot}>
      {children}
    </EgEdsAnimaPageShot>
  );
}
