import { View } from 'react-native';

import { EgDivider } from '@/eds/team-icons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { teamCenterMenuRowDividerInsets } from '@/scenes/team/teamCenterDataListLayout';

type TeamCenterMenuRowDividerProps = {
  /** 圆角分组卡内行 — 与行 `marginH` 归零一致。 */
  inCardShell?: boolean;
};

/** 团队中心 · 同行菜单项之间的分割线（左缘对齐主标题 · 行间 gap 0）。 */
export function TeamCenterMenuRowDivider({
  inCardShell = false,
}: TeamCenterMenuRowDividerProps) {
  const { mode, spacing } = useEdsTheme();
  const insets = teamCenterMenuRowDividerInsets(spacing, inCardShell);

  return (
    <View style={{ paddingLeft: insets.paddingLeft, paddingRight: insets.paddingRight }}>
      <EgDivider variant="module" mode={mode} />
    </View>
  );
}