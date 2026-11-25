import { useCallback, type PropsWithChildren } from 'react';

import { EgPageShot, type EgPageShotRootApi, type EgPageShotSource } from '@/eds/page-shot';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamPlanPageShotRoot } from '@/scenes/team/TeamPlanPageShotRoot';
import { TEAM_PLAN_PAGE_SHOT_ID } from '@/scenes/team/teamPlanPageShot';

/**
 * 团队中心 · `EgPageShot` 宿主 — 套餐卡对齐 Showcase `PageShotDemo` 卡片：
 * `title` 根页 `undefined`（`floatingRoot`）· `background` 按 shot id · `renderRoot` = `CardShotRoot` 形。
 */
export function TeamCenterPageShotHost({ children }: PropsWithChildren) {
  const { mode } = useEdsTheme();
  const colors = useThemeColors();

  const renderRoot = useCallback(
    (api: EgPageShotRootApi) => <TeamPlanPageShotRoot api={api} />,
    [],
  );

  const title = useCallback(
    (source: EgPageShotSource, pageKey: string | null) =>
      pageKey ?? (source.id === TEAM_PLAN_PAGE_SHOT_ID ? undefined : undefined),
    [],
  );

  const cardShellBackground = String(colors['material-card-moderate']);
  const pageBackground = String(colors['box-page']);

  /** 对齐 `PageShotDemo`：`shot.id === 'card'` → 触发卡同色外壳，收回时与列表卡无缝落位。 */
  const background = useCallback(
    (source: EgPageShotSource) =>
      source.id === TEAM_PLAN_PAGE_SHOT_ID ? cardShellBackground : pageBackground,
    [cardShellBackground, pageBackground],
  );

  return (
    <EgPageShot
      mode={mode}
      title={title}
      background={background}
      scrollEdgeEffect="hidden"
      renderRoot={renderRoot}
    >
      {children}
    </EgPageShot>
  );
}