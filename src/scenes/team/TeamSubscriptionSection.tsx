import type { PropsWithChildren, ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgLink } from '@/eds/link-button';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

type TeamSubscriptionSectionProps = PropsWithChildren<{
  title: string;
  /** 主标题下副文案 · 与标题间距 `spacing-0`（0px）。 */
  subtitle?: string;
  /** 根页已由 `EG_PAGE_CONTENT_PADDING_HORIZONTAL` 留白时传 `false`。 */
  pageGutter?: boolean;
  /** 标题与内容块左右外距 · `spacing-2`（8px）。 */
  blockMarginH?: boolean;
  /** 标题区与内容纵向间距 · 默认 `spacing-8`（32px）；`spacing-2` = 8px（标题至数据行）。 */
  titleBodyGap?: 'spacing-0' | 'spacing-1' | 'spacing-2' | 'spacing-3' | 'spacing-8';
  trailing?: {
    label: string;
    onPress?: () => void;
    accessibilityLabel?: string;
  };
}>;

/** 订阅稿 · 分组标题 + 可选右侧链。 */
export function TeamSubscriptionSection({
  title,
  subtitle,
  pageGutter = true,
  blockMarginH = false,
  titleBodyGap = 'spacing-8',
  trailing,
  children,
}: TeamSubscriptionSectionProps) {
  const { mode, spacing } = useEdsTheme();
  const sceneInset = pageGutter ? edsSceneContentInset(spacing) : 0;
  const blockMargin = blockMarginH ? edsPx(spacing['spacing-2']) : 0;
  const sectionGap = edsPx(spacing[titleBodyGap]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          gap: sectionGap,
        },
        head: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: edsPx(spacing['spacing-3']),
          paddingHorizontal: sceneInset,
          marginHorizontal: blockMargin,
        },
        content: {
          marginHorizontal: blockMargin,
        },
        titleCol: {
          flex: 1,
          minWidth: 0,
          gap: edsPx(spacing['spacing-0']),
        },
      }),
    [blockMargin, sceneInset, sectionGap, spacing],
  );

  let trailingNode: ReactNode = null;
  if (trailing != null) {
    trailingNode = (
      <EgLink
        mode={mode}
        size="sm"
        label={trailing.label}
        onPress={trailing.onPress}
        accessibilityLabel={trailing.accessibilityLabel ?? trailing.label}
      />
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.head}>
        <View style={styles.titleCol}>
          <SceneText variant="title">{title}</SceneText>
          {subtitle != null && subtitle.length > 0 ? (
            <SceneText variant="bodySmallSecondary">{subtitle}</SceneText>
          ) : null}
        </View>
        {trailingNode}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}