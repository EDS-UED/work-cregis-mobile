import type { PropsWithChildren, ReactNode } from 'react';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

type TeamSubscriptionSectionProps = PropsWithChildren<{
  title: string;
  trailing?: {
    label: string;
    onPress?: () => void;
    accessibilityLabel?: string;
  };
}>;

/** 订阅稿 · 分组标题 + 可选右侧链。 */
export function TeamSubscriptionSection({
  title,
  trailing,
  children,
}: TeamSubscriptionSectionProps) {
  const { spacing, colors } = useEdsTheme();
  const sceneInset = edsSceneContentInset(spacing);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          gap: edsPx(spacing['spacing-3']),
        },
        head: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: edsPx(spacing['spacing-3']),
          paddingHorizontal: sceneInset,
        },
        title: {
          flex: 1,
          minWidth: 0,
        },
        trailPress: {
          flexShrink: 0,
        },
        body: {
          gap: edsPx(spacing['spacing-3']),
          paddingHorizontal: sceneInset,
        },
      }),
    [sceneInset, spacing],
  );

  let trailingNode: ReactNode = null;
  if (trailing != null) {
    trailingNode = (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={trailing.accessibilityLabel ?? trailing.label}
        onPress={trailing.onPress}
        style={styles.trailPress}
        hitSlop={edsPx(spacing['spacing-2'])}
      >
        <SceneText variant="bodySmallStrong" style={{ color: colors['box-color-brand'] }}>
          {trailing.label}
        </SceneText>
      </Pressable>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.head}>
        <SceneText variant="bodySmallSemibold" style={[styles.title, { color: colors['text-base-secondary'] }]}>
          {title}
        </SceneText>
        {trailingNode}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}