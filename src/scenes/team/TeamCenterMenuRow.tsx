import { useMemo } from 'react';
import { View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgDataListRow } from '@/eds/data-list';
import { TeamCenterMenuLeadIcon } from '@/scenes/team/TeamCenterMenuLeadIcon';
import { TeamCenterMenuRowDivider } from '@/scenes/team/TeamCenterMenuRowDivider';
import {
  getTeamCenterDataListRowLayout,
  teamCenterDataListMediaGap,
} from '@/scenes/team/teamCenterDataListLayout';
import { LIST_ROW_CHEVRON_STROKE_TOKEN } from '@/scenes/shared/listDisclosureChevron';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type TeamCenterMenuRowProps = {
  icon: string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  testID?: string;
  /** 圆角分组卡内行 — 卡壳已留 `spacing-2`，行 `marginH` 归零。 */
  inCardShell?: boolean;
  /** 列表末行 — 不渲染底部分割线。 */
  isLast?: boolean;
};

export function TeamCenterMenuRow({
  icon,
  label,
  subtitle,
  onPress,
  testID,
  inCardShell = false,
  isLast = false,
}: TeamCenterMenuRowProps) {
  const { mode, spacing } = useEdsTheme();
  const layout = useMemo(() => {
    const base = getTeamCenterDataListRowLayout(spacing);
    return inCardShell ? { ...base, marginH: 0 } : base;
  }, [inCardShell, spacing]);
  const mediaGap = teamCenterDataListMediaGap(spacing);

  return (
    <>
      <EgDataListRow
        mode={mode}
        testID={testID}
        accessibilityLabel={label}
        onPress={onPress}
        layout={layout}
        gap={mediaGap}
      >
        <TeamCenterMenuLeadIcon icon={icon} />
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
              gap: subtitle != null ? edsPx(spacing['spacing-05']) : 0,
            }}
          >
            <SceneText variant="bodySemibold">{label}</SceneText>
            {subtitle != null ? (
              <SceneText variant="bodySmallSecondary">{subtitle}</SceneText>
            ) : null}
          </View>
          <EgSymbol
            name="eds-arrow-right-mini-ios"
            mode={mode}
            size="sm"
            strokeColorToken={LIST_ROW_CHEVRON_STROKE_TOKEN}
            accessibilityLabel=""
          />
        </View>
      </EgDataListRow>
      {!isLast ? <TeamCenterMenuRowDivider inCardShell={inCardShell} /> : null}
    </>
  );
}
