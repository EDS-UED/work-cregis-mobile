import { useCallback, useState } from 'react';
import { useHomeStore } from '@/store';
import type { CompareTeamCenterCardVariant } from '@/scenes/compare/team-center-card/compareTeamCenterCardVariant';
import { CompareTeamCenterCardContent } from '@/scenes/compare/team-center-card/CompareTeamCenterCardContent';
import { TeamCenterNavTitle } from '@/scenes/team/TeamCenterNavTitle';
import { TeamSwitcherSheet } from '@/scenes/team/TeamSwitcherSheet';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';

type CompareTeamCenterCardSceneProps = {
  variant: CompareTeamCenterCardVariant;
};

/** 对比页 · 团队中心快照（正文三张菜单卡片 · 底纹 traditional / gray）。 */
function CompareTeamCenterCardSceneShell({ variant }: CompareTeamCenterCardSceneProps) {
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const openSwitcher = useCallback(() => setSwitcherOpen(true), []);
  const closeSwitcher = useCallback(() => setSwitcherOpen(false), []);

  const renderNavTitle = useCallback(
    () => <TeamCenterNavTitle onOpenSwitcher={openSwitcher} />,
    [openSwitcher],
  );

  return (
    <>
      <SceneScaffold
        title={teamDisplayName}
        showNavBack
        pageBackground={variant === 'traditional' ? 'card' : 'default'}
        customHeaderTitle={renderNavTitle}
      >
        <CompareTeamCenterCardContent variant={variant} />
      </SceneScaffold>
      <TeamSwitcherSheet visible={switcherOpen} onDismiss={closeSwitcher} />
    </>
  );
}

export function CompareTeamCenterCardTraditionalScene() {
  return <CompareTeamCenterCardSceneShell variant="traditional" />;
}

export function CompareTeamCenterCardGrayScene() {
  return <CompareTeamCenterCardSceneShell variant="gray" />;
}