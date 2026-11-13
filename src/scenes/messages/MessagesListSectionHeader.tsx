import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

type MessagesListSectionHeaderProps = {
  label: string;
};

/** 通知 DL · 分组标题行：`eds-calendar`（`symbol-xs` 16px）+ `typography-body-small-heavy`。 */
export function MessagesListSectionHeader({ label }: MessagesListSectionHeaderProps) {
  const { mode, spacing, colors, typography } = useEdsTheme();
  /** 分组日历行 · 距屏左 `spacing-5`（20px），与 Scene 内容边距一致。 */
  const sectionInset = edsSceneContentInset(spacing);
  const calendarPx = edsPx(spacing['symbol-xs']);
  const labelLineHeight = edsPx(typography['line-height-body-small']);
  const labelColor = String(colors['text-base-secondary']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-1-5']),
          paddingHorizontal: sectionInset,
        },
        iconSlot: {
          height: labelLineHeight,
          justifyContent: 'center',
          alignItems: 'center',
        },
        iconNudge: {
          marginTop: -edsPx(spacing['spacing-05']),
        },
      }),
    [labelLineHeight, sectionInset, spacing],
  );

  return (
    <View style={styles.row}>
      <View style={[styles.iconSlot, styles.iconNudge]}>
        <EgSymbol
          name="eds-calendar"
          mode={mode}
          displayPx={calendarPx}
          strokeColorToken="text-base-secondary"
          accessibilityLabel=""
        />
      </View>
      <SceneText variant="bodySmallHeavy" style={{ color: labelColor }}>
        {label}
      </SceneText>
    </View>
  );
}
