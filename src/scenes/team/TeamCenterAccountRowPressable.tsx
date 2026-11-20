import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { EgDataListRowPressable } from '@/eds/data-list';
import {
  TEAM_CENTER_ACCOUNT_CARD_PRESS_INTENSITY,
} from '@/scenes/team/teamCenterEgItemLayout';

type TeamCenterAccountRowPressableProps = {
  testID?: string;
  accessibilityLabel?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/**
 * 团队账户行点按 · `EgDataListRowPressable`（轻扫 / 快滑不触发缩放 · 仅内容区样式）。
 */
export function TeamCenterAccountRowPressable({
  testID,
  accessibilityLabel,
  onPress,
  style,
  children,
}: TeamCenterAccountRowPressableProps) {
  return (
    <EgDataListRowPressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      pressIntensity={TEAM_CENTER_ACCOUNT_CARD_PRESS_INTENSITY}
      style={style}
    >
      {children}
    </EgDataListRowPressable>
  );
}