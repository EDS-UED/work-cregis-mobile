import { useCallback, useState } from 'react';
import { useHomeStore } from '@/store';
import { TeamCenterContent } from '@/scenes/team/TeamCenterContent';
import { TeamCenterNavTitle } from '@/scenes/team/TeamCenterNavTitle';
import { TeamSwitcherSheet } from '@/scenes/team/TeamSwitcherSheet';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';

export function TeamCenterScene() {
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
        shortPageScrollLayout
        pageBackground="default"
        customHeaderTitle={renderNavTitle}
      >
        <TeamCenterContent />
      </SceneScaffold>
      <TeamSwitcherSheet visible={switcherOpen} onDismiss={closeSwitcher} />
    </>
  );
}
