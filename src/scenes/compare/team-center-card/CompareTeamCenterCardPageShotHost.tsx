import { useCallback, type PropsWithChildren } from 'react';

import { EgPageShot, type EgPageShotRootApi, type EgPageShotSource } from '@/eds/page-shot';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamPlanPageShotRoot } from '@/scenes/team/TeamPlanPageShotRoot';
import { TEAM_PLAN_PAGE_SHOT_ID } from '@/scenes/team/teamPlanPageShot';

/** 对比页 · page-shot 宿主快照（`EgPageShot`）。 */
export function CompareTeamCenterCardPageShotHost({ children }: PropsWithChildren) {
  const { mode } = useEdsTheme();
  const colors = useThemeColors();

  const renderRoot = useCallback((api: EgPageShotRootApi) => <TeamPlanPageShotRoot api={api} />, []);

  const title = useCallback(
    (source: EgPageShotSource, pageKey: string | null) =>
      pageKey ?? (source.id === TEAM_PLAN_PAGE_SHOT_ID ? undefined : undefined),
    [],
  );

  const cardShellBackground = String(colors['material-card-moderate']);
  const pageBackground = String(colors['box-page']);

  const background = useCallback(
    (source: EgPageShotSource) =>
      source.id === TEAM_PLAN_PAGE_SHOT_ID ? cardShellBackground : pageBackground,
    [cardShellBackground, pageBackground],
  );

  return (
    <EgPageShot mode={mode} title={title} background={background} renderRoot={renderRoot}>
      {children}
    </EgPageShot>
  );
}