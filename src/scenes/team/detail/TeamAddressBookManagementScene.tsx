import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { TeamAddressBookDetailContent } from '@/scenes/team/detail/TeamAddressBookDetailContent';
import { TeamMemberSearchDock } from '@/scenes/team/detail/TeamMemberSearchDock';
import { teamMemberSearchChromeReserve } from '@/scenes/team/detail/teamMemberSearchDockLayout';

type TeamAddressBookManagementSceneProps = {
  title: string;
  overlayNavTrailing?: React.ReactNode;
};

/** 地址簿 · 底栏 `EgSearch`（与成员管理同源）。 */
export function TeamAddressBookManagementScene({
  title,
  overlayNavTrailing,
}: TeamAddressBookManagementSceneProps) {
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
      <TeamAddressBookDetailContent query={query} />
    </SceneScaffold>
  );
}