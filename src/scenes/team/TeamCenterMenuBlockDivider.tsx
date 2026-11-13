import { View } from 'react-native';

import { EgDivider } from '@/eds/team-icons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  teamCenterListEdgeFromScreen,
} from '@/scenes/team/teamCenterDataListLayout';
import { edsPx } from '@/utils/edsTheme';

/** 团队中心 · 分块模块分割线（左右距屏 `spacing-6` · 上下 spacing-3）。 */
export function TeamCenterMenuBlockDivider() {
  const { mode, spacing } = useEdsTheme();
  const listEdge = teamCenterListEdgeFromScreen(spacing);
  const dividerInset = edsPx(spacing['spacing-6']);
  const blockGap = edsPx(spacing['spacing-3']);

  return (
    <View
      style={{
        paddingHorizontal: Math.max(0, dividerInset - listEdge),
        paddingVertical: blockGap,
      }}
    >
      <EgDivider variant="module" mode={mode} />
    </View>
  );
}
