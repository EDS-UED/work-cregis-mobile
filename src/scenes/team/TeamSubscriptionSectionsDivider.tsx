import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgDivider } from '@/eds/team-icons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgDividerEnd } from '@/scenes/shared/EgDividerEnd';
import {
  teamSubscriptionSectionDividerInsetBottom,
  teamSubscriptionSectionDividerInsetTop,
} from '@/scenes/team/teamSubscriptionItemLayout';

type TeamSubscriptionSectionsDividerProps = {
  /** 默认保留分割线下 `spacing-3`；紧邻客户经理条时关以免与卡顶距叠算。 */
  insetBottom?: boolean;
  /** `module` 通栏线 · `end` 尾分（{@link EgDividerEnd}）。 */
  variant?: 'module' | 'end';
};

/** 订阅正文 · 区段分割线 · 默认上下 `spacing-3`（12px）。 */
export function TeamSubscriptionSectionsDivider({
  insetBottom = true,
  variant = 'module',
}: TeamSubscriptionSectionsDividerProps) {
  const { mode, spacing } = useEdsTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        shell: {
          paddingTop: teamSubscriptionSectionDividerInsetTop(spacing),
          paddingBottom: insetBottom ? teamSubscriptionSectionDividerInsetBottom(spacing) : 0,
        },
      }),
    [insetBottom, spacing],
  );

  return (
    <View style={styles.shell}>
      {variant === 'end' ? (
        <EgDividerEnd />
      ) : (
        <EgDivider variant="module" mode={mode} />
      )}
    </View>
  );
}