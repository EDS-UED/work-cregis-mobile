import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgDivider } from '@/eds/team-icons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  teamSubscriptionSectionDividerInsetBottom,
  teamSubscriptionSectionDividerInsetTop,
} from '@/scenes/team/teamSubscriptionItemLayout';

/** 订阅正文 · 权益与财务之间的 module 分割线 · 上下 `spacing-3`（12px）。 */
export function TeamSubscriptionSectionsDivider() {
  const { mode, spacing } = useEdsTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        shell: {
          paddingTop: teamSubscriptionSectionDividerInsetTop(spacing),
          paddingBottom: teamSubscriptionSectionDividerInsetBottom(spacing),
        },
      }),
    [spacing],
  );

  return (
    <View style={styles.shell}>
      <EgDivider variant="module" mode={mode} />
    </View>
  );
}