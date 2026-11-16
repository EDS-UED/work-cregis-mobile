import { useMemo } from 'react';
import { View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgDataListRow } from '@/eds/data-list';
import { TeamCenterMenuLeadIcon } from '@/scenes/team/TeamCenterMenuLeadIcon';
import {
  getTeamCenterDataListRowLayout,
  teamCenterDataListMediaGap,
} from '@/scenes/team/teamCenterDataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type TeamCenterMenuRowProps = {
  label: string;
  subtitle: string;
  onPress?: () => void;
  testID?: string;
  /** 圆角分组卡内行 — 卡壳已留 `spacing-2`，行 `marginH` 归零。 */
  inCardShell?: boolean;
};

export function TeamCenterMenuRow({
  label,
  subtitle,
  onPress,
  testID,
  inCardShell = false,
}: TeamCenterMenuRowProps) {
  const { mode, spacing } = useEdsTheme();
  const layout = useMemo(() => {
    const base = getTeamCenterDataListRowLayout(spacing);
    return inCardShell ? { ...base, marginH: 0 } : base;
  }, [inCardShell, spacing]);
  const mediaGap = teamCenterDataListMediaGap(spacing);

  return (
    <EgDataListRow
      mode={mode}
      testID={testID}
      accessibilityLabel={label}
      onPress={onPress}
      layout={layout}
      gap={mediaGap}
    >
      <TeamCenterMenuLeadIcon />
      <View
        style={{
          flex: 1,
          minWidth: 0,
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-8']),
        }}
      >
        <View
          style={{
            flex: 1,
            minWidth: 0,
            gap: edsPx(spacing['spacing-05']),
          }}
        >
          <SceneText variant="bodySemibold">{label}</SceneText>
          <SceneText variant="bodySmallSecondary">{subtitle}</SceneText>
        </View>
        <EgSymbol
          name="eds-arrow-right-mini-ios"
          mode={mode}
          size="sm"
          strokeColorToken="text-base-secondary"
          accessibilityLabel=""
        />
      </View>
    </EgDataListRow>
  );
}
