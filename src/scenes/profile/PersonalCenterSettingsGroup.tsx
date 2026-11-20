import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { EgItemGroup } from '@/eds/item';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type PersonalCenterSettingsGroupProps = {
  /** 省略时不渲染区段标题（如账户组）。 */
  sectionTitle?: string;
  /** 覆盖 `EgItemGroup` 容器（如团队卡 `material-card-moderate`）。 */
  itemGroupStyle?: ViewStyle;
  /** 区段底外边距；默认 `spacing-4`。团队中心账户卡传 `0` 由正文栈 `gap` 控距。 */
  marginBottom?: number;
  children: ReactNode;
};

export function PersonalCenterSettingsGroup({
  sectionTitle,
  itemGroupStyle,
  marginBottom: marginBottomOverride,
  children,
}: PersonalCenterSettingsGroupProps) {
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          gap: edsPx(spacing['spacing-2']),
          marginBottom:
            marginBottomOverride ?? edsPx(spacing['spacing-4']),
        },
        sectionTitle: {
          marginLeft: edsPx(spacing['spacing-5']),
        },
      }),
    [marginBottomOverride, spacing],
  );

  return (
    <View style={styles.section}>
      {sectionTitle ? (
        <SceneText
          variant="bodySmallSemibold"
          style={[styles.sectionTitle, { color: colors['text-base-secondary'] }]}
        >
          {sectionTitle}
        </SceneText>
      ) : null}
      <EgItemGroup mode={mode} style={itemGroupStyle}>
        {children}
      </EgItemGroup>
    </View>
  );
}