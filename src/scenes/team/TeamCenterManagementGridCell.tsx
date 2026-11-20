import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgDataListRowPressable } from '@/eds/data-list';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import {
  TEAM_CENTER_MANAGEMENT_GRID_CARD_RADIUS,
  TEAM_CENTER_MANAGEMENT_GRID_CELL_PAD_H,
  TEAM_CENTER_MANAGEMENT_GRID_CELL_PAD_V,
  TEAM_CENTER_MANAGEMENT_GRID_ICON_LABEL_GAP,
  TEAM_CENTER_MANAGEMENT_GRID_PRESS_INTENSITY,
} from '@/scenes/team/teamCenterEgItemLayout';
import { edsPx } from '@/utils/edsTheme';

type TeamCenterManagementGridCellProps = {
  testID?: string;
  width: number;
  label: string;
  icon: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** 团队管理灰底卡 · `EgDataListRowPressable`（轻扫 / 快滑不触发 · 无 tap 底色）。 */
export function TeamCenterManagementGridCell({
  testID,
  width,
  label,
  icon,
  onPress,
  accessibilityLabel,
}: TeamCenterManagementGridCellProps) {
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();
  const padH = edsPx(spacing[TEAM_CENTER_MANAGEMENT_GRID_CELL_PAD_H]);
  const padV = edsPx(spacing[TEAM_CENTER_MANAGEMENT_GRID_CELL_PAD_V]);
  const iconLabelGap = edsPx(spacing[TEAM_CENTER_MANAGEMENT_GRID_ICON_LABEL_GAP]);
  const radius = edsPx(spacing[TEAM_CENTER_MANAGEMENT_GRID_CARD_RADIUS]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          width,
          backgroundColor: String(colors['material-card-shallow']),
          borderRadius: radius,
          overflow: 'hidden',
        },
        content: {
          paddingHorizontal: padH,
          paddingVertical: padV,
          gap: iconLabelGap,
          alignItems: 'center',
        },
      }),
    [colors, iconLabelGap, padH, padV, radius, width],
  );

  const a11y = accessibilityLabel ?? label;

  return (
    <EgDataListRowPressable
      testID={testID}
      accessibilityLabel={a11y}
      onPress={onPress}
      pressIntensity={TEAM_CENTER_MANAGEMENT_GRID_PRESS_INTENSITY}
      style={styles.card}
    >
      <View style={styles.content}>
        {icon}
        <SceneText
          variant="bodySmall"
          numberOfLines={2}
          style={{
            alignSelf: 'stretch',
            textAlign: 'center',
          }}
        >
          {label}
        </SceneText>
      </View>
    </EgDataListRowPressable>
  );
}