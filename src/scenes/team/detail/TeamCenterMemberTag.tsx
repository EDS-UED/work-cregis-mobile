import { View } from 'react-native';

import { EgTag } from '@/eds/tag';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useTranslation } from 'react-i18next';

import type { TeamMemberTag } from '@/scenes/team/detail/teamMemberDetailMock';
import { edsPx } from '@/utils/edsTheme';

function TeamCenterMemberTagSingle({ tag }: { tag: Exclude<TeamMemberTag, null> }) {
  const { mode } = useEdsTheme();
  const { t } = useTranslation();

  const labelKeyMap: Record<Exclude<TeamMemberTag, null>, string> = {
    owner: 'team.memberTagOwner',
    self: 'team.memberTagSelf',
    pending: 'team.memberTagPending',
    disabled: 'team.memberTagDisabled',
    removed: 'team.memberTagRemoved',
  };
  const label = t(labelKeyMap[tag]);

  if (tag === 'owner' || tag === 'self') {
    return (
      <EgTag
        family="system"
        variant="stroke-subtle"
        size="sm"
        rowAlign
        mode={mode}
        label={label}
        accessibilityLabel={label}
      />
    );
  }

  if (tag === 'pending') {
    return (
      <EgTag
        family="status"
        status="warning"
        variant="subtle"
        size="sm"
        rowAlign
        mode={mode}
        label={label}
        accessibilityLabel={label}
      />
    );
  }

  if (tag === 'disabled') {
    return (
      <EgTag
        family="status"
        status="danger"
        variant="subtle"
        size="sm"
        rowAlign
        mode={mode}
        label={label}
        accessibilityLabel={label}
      />
    );
  }

  return (
    <EgTag
      family="system"
      variant="gray"
      size="sm"
      rowAlign
      mode={mode}
      label={label}
      accessibilityLabel={label}
    />
  );
}

/** 成员行标签 · 创建人/本人 `stroke-subtle` 横排成组。 */
export function TeamCenterMemberTags({
  tags,
}: {
  tags: Exclude<TeamMemberTag, null>[];
}) {
  const { spacing } = useEdsTheme();
  const tagGap = edsPx(spacing['spacing-1']);

  const ordered = [...tags].sort((a, b) => {
    const rank = (tag: Exclude<TeamMemberTag, null>) =>
      tag === 'owner' ? 0 : tag === 'self' ? 1 : 2;
    return rank(a) - rank(b);
  });

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: tagGap, flexShrink: 1 }}>
      {ordered.map((tag) => (
        <TeamCenterMemberTagSingle key={tag} tag={tag} />
      ))}
    </View>
  );
}

export {
  groupTeamMembersBySection,
  memberRowDisplayTags,
  teamMemberSectionTitleKey,
} from '@/scenes/team/detail/teamMemberListSections';
export type { TeamMemberListBucket, TeamMemberSectionBlock } from '@/scenes/team/detail/teamMemberListSections';