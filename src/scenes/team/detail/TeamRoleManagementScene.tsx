import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { TeamMemberSearchDock } from '@/scenes/team/detail/TeamMemberSearchDock';
import { TeamRolesDetailContent } from '@/scenes/team/detail/TeamRolesDetailContent';
import { teamMemberSearchChromeReserve } from '@/scenes/team/detail/teamMemberSearchDockLayout';

type TeamRoleManagementSceneProps = {
  title: string;
  overlayNavTrailing?: React.ReactNode;
};

/** 角色管理 · 底栏 `EgSearch`（与成员管理同源）。 */
export function TeamRoleManagementScene({
  title,
  overlayNavTrailing,
}: TeamRoleManagementSceneProps) {
  const { spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const chromeReserve = teamMemberSearchChromeReserve(spacing, insets.bottom);

  return (
    <SceneScaffold
      title={title}
      showNavBack
      pageBackground="default"
      shortPageScrollLayout
      fixedBottomChromeReserve={chromeReserve}
      overlayNavTrailing={overlayNavTrailing}
      fixedBottomChrome={
        <TeamMemberSearchDock query={query} onChangeQuery={setQuery} />
      }
    >
      <TeamRolesDetailContent query={query} />
    </SceneScaffold>
  );
}