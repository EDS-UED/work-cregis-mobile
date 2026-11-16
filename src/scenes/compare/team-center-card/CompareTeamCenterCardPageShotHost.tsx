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

/** 对比页 · page-shot 宿主快照。 */
export function CompareTeamCenterCardPageShotHost({ children }: PropsWithChildren) {
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
