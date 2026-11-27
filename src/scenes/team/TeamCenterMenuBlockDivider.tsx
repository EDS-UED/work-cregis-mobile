import { View } from 'react-native';

import { EgDivider } from '@/eds/team-icons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  teamCenterBlockDividerInsetH,
  teamCenterBlockDividerInsetV,
} from '@/scenes/team/teamCenterDataListLayout';

/**
 * 团队中心 · 分块模块分割线。
 * 左右距屏 `spacing-5`（20px）· 上下 `spacing-3`；**须**置于 `EgDataList` DL-bleed 内。
 */
export function TeamCenterMenuBlockDivider() {
  const { mode, spacing } = useEdsTheme();
  const insetH = teamCenterBlockDividerInsetH(spacing);
  const insetV = teamCenterBlockDividerInsetV(spacing);

  return (
    <View style={{ paddingHorizontal: insetH, paddingVertical: insetV }}>
      <EgDivider variant="module" mode={mode} />
    </View>
  );
}