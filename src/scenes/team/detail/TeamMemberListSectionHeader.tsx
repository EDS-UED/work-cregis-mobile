import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import type { TeamMemberListBucket } from '@/scenes/team/detail/teamMemberListSections';
import {
  teamMemberSectionHeaderIcon,
  teamMemberSectionHeaderIconColor,
  teamMemberSectionHeaderIconLabelGap,
} from '@/scenes/team/detail/teamMemberListSectionLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

type TeamMemberListSectionHeaderProps = {
  bucket: TeamMemberListBucket;
  label: string;
};

/**
 * 成员管理 · 分组标题。
 * 字号 / 色值与通知分类内页 {@link MessagesListSectionHeader} 同源（`typography-body-small-heavy`）。
 */
export function TeamMemberListSectionHeader({ bucket, label }: TeamMemberListSectionHeaderProps) {
  const { mode, spacing, colors, typography } = useEdsTheme();
  const sectionInset = edsSceneContentInset(spacing);
  const labelColor = String(colors['text-base-secondary']);
  const leadIcon = teamMemberSectionHeaderIcon(bucket);
  const iconPx = edsPx(spacing['symbol-xs']);
  const labelLineHeight = edsPx(typography['line-height-body-small']);
  const iconLabelGap = teamMemberSectionHeaderIconLabelGap(spacing);
  const iconColorToken = teamMemberSectionHeaderIconColor(bucket);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: iconLabelGap,
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
        host: {
          paddingHorizontal: sectionInset,
        },
      }),
    [iconLabelGap, labelLineHeight, sectionInset, spacing],
  );

  if (leadIcon) {
    return (
      <View style={styles.row}>
        <View style={[styles.iconSlot, styles.iconNudge]}>
          <EgSymbol
            name={leadIcon}
            mode={mode}
            displayPx={iconPx}
            strokeColorToken={iconColorToken}
            accessibilityLabel=""
          />
        </View>
        <SceneText variant="bodySmallHeavy" style={{ color: labelColor }}>
          {label}
        </SceneText>
      </View>
    );
  }

  return (
    <View style={styles.host}>
      <SceneText variant="bodySmallHeavy" style={{ color: labelColor }}>
        {label}
      </SceneText>
    </View>
  );
}