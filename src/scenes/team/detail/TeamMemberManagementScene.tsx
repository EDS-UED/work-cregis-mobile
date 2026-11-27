import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { TeamMemberLocateRail } from '@/scenes/team/detail/TeamMemberLocateRail';
import { TeamMembersDetailContent } from '@/scenes/team/detail/TeamMembersDetailContent';
import { TeamMemberSearchDock } from '@/scenes/team/detail/TeamMemberSearchDock';
import { teamMemberLocateRailInsetTop } from '@/scenes/team/detail/teamMemberLocateLayout';
import { teamMemberSearchChromeReserve } from '@/scenes/team/detail/teamMemberSearchDockLayout';

type TeamMemberManagementSceneProps = {
  title: string;
  overlayNavTrailing?: React.ReactNode;
};

/** 成员管理 · 底栏 `EgSearch` + 右侧浮动 `EgLocate`（不占列表宽度）。 */
export function TeamMemberManagementScene({
  title,
  overlayNavTrailing,
}: TeamMemberManagementSceneProps) {
  const { spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const locateOffsetsRef = useRef<Record<string, number>>({});

  const chromeReserve = teamMemberSearchChromeReserve(spacing, insets.bottom);
  const locateInsetTop = teamMemberLocateRailInsetTop(spacing, insets.top);
  const showLocate = query.trim().length === 0;

  return (
    <SceneScaffold
      title={title}
      showNavBack
      pageBackground="default"
      shortPageScrollLayout
      bodyShowsVerticalScrollIndicator={false}
      fixedBottomChromeReserve={chromeReserve}
      onBodyScrollRef={(node) => {
        scrollRef.current = node;
      }}
      bodyScrollOverlay={
        showLocate ? (
          <TeamMemberLocateRail
            scrollRef={scrollRef}
            locateOffsetsRef={locateOffsetsRef}
            insetTop={locateInsetTop}
            insetBottom={chromeReserve}
          />
        ) : null
      }
      overlayNavTrailing={overlayNavTrailing}
      fixedBottomChrome={
        <TeamMemberSearchDock query={query} onChangeQuery={setQuery} />
      }
    >
      <TeamMembersDetailContent query={query} locateOffsetsRef={locateOffsetsRef} />
    </SceneScaffold>
  );
}