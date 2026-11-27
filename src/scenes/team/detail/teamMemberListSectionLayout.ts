import type { ViewStyle } from 'react-native';

import type { TeamMemberListBucket } from '@/scenes/team/detail/teamMemberListSections';
import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

const TEAM_MEMBER_SECTION_HEADER_ICON: Partial<Record<TeamMemberListBucket, string>> = {
  creator: 'eds-pentagram-fill',
  pending: 'eds-clocks-fill',
};

export function teamMemberSectionHeaderIcon(
  bucket: TeamMemberListBucket,
): string | undefined {
  return TEAM_MEMBER_SECTION_HEADER_ICON[bucket];
}

/** 分组标题 · 图标与文案间距 · `spacing-1`（4px）。 */
export function teamMemberSectionHeaderIconLabelGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-1']);
}

export function teamMemberSectionHeaderIconColor(
  bucket: TeamMemberListBucket,
): 'material-brand' | 'status-danger' {
  return bucket === 'creator' ? 'material-brand' : 'status-danger';
}

/** 标题 ↔ 本组行 · 与 {@link MessagesCategoryScene} `styles.section` 一致 · `spacing-1-5`。 */
export function teamMemberSectionTitleToRowsGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-1-5']);
}

export function teamMemberSectionShellStyle(
  spacing: typeof mobileTheme.spacing,
): ViewStyle {
  return { gap: teamMemberSectionTitleToRowsGap(spacing) };
}