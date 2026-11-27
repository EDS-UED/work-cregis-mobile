import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsSceneContentInset } from '@/utils/edsTheme';

type MessagesListSectionHeaderProps = {
  label: string;
};

/** 通知 DL · 分组标题行 · `typography-body-small-heavy`。日历图标不展示。 */
export function MessagesListSectionHeader({ label }: MessagesListSectionHeaderProps) {
  const { spacing, colors } = useEdsTheme();
  /** 分组标题 · 距屏左 `spacing-5`，与 Scene 内容边距一致。 */
  const sectionInset = edsSceneContentInset(spacing);
  const labelColor = String(colors['text-base-secondary']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: sectionInset,
        },
      }),
    [sectionInset],
  );

  return (
    <View style={styles.row}>
      <SceneText variant="bodySmallHeavy" style={{ color: labelColor }}>
        {label}
      </SceneText>
    </View>
  );
}
