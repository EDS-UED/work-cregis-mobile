import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgAvatar } from '@/eds/button-glass';
import { EgDataList } from '@/eds/data-list';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamCenterDetailDataListRow } from '@/scenes/team/detail/TeamCenterDetailDataListRow';
import {
  groupTeamMembersBySection,
  memberRowDisplayTags,
  TeamCenterMemberTags,
  teamMemberSectionTitleKey,
} from '@/scenes/team/detail/TeamCenterMemberTag';
import { TeamMemberListSectionHeader } from '@/scenes/team/detail/TeamMemberListSectionHeader';
import { teamMemberSectionShellStyle } from '@/scenes/team/detail/teamMemberListSectionLayout';
import { teamMemberLocateKey } from '@/scenes/team/detail/teamMemberLocate';
import {
  TEAM_MEMBER_ROWS,
  teamMemberDisplayColorIndex,
} from '@/scenes/team/detail/teamMemberDetailMock';
import {
  teamCenterDataListRowGap,
  teamMemberSectionGroupGap,
} from '@/scenes/team/teamCenterDataListLayout';
import { maskEmail } from '@/utils/maskEmail';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

/** DL 行首 · `avatar-xl` 槽（与通知列表 `MessagesListLeadIcon` 同源）。 */
function MemberAvatarLead({
  name,
  colorIndex,
  active,
}: {
  name: string;
  colorIndex: number;
  active: boolean;
}) {
  const { spacing, mode } = useEdsTheme();
  const colors = useThemeColors();
  const slot = edsPx(spacing['avatar-xl']);
  const dotPx = edsPx(spacing['spacing-1-5']);
  const ring = edsPx(spacing['spacing-05']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        host: {
          width: slot,
          height: slot,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'visible',
        },
        statusDot: {
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: dotPx,
          height: dotPx,
          borderRadius: dotPx / 2,
          borderWidth: ring,
          borderColor: String(colors['box-page']),
        },
      }),
    [colors, dotPx, ring, slot],
  );

  return (
    <View style={styles.host}>
      <EgAvatar name={name} size="xl" colorIndex={colorIndex} accessibilityLabel={name} />
      <View
        pointerEvents="none"
        style={[
          styles.statusDot,
          {
            backgroundColor: String(
              active ? colors['status-decor'] : colors['status-disable-base'],
            ),
          },
        ]}
      />
    </View>
  );
}

type TeamMembersDetailContentProps = {
  query: string;
  locateOffsetsRef?: RefObject<Record<string, number>>;
};

/** 成员列表 · 分组标题 + `EgDataList` · 布局同源 {@link MessagesCategoryScene}。 */
export function TeamMembersDetailContent({
  query,
  locateOffsetsRef,
}: TeamMembersDetailContentProps) {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();
  const sceneInset = edsSceneContentInset(spacing);
  const sectionGroupGap = teamMemberSectionGroupGap(spacing);
  const dataListOffsetY = useRef(0);
  const registeredLocateKeys = useRef(new Set<string>());

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = !q
      ? TEAM_MEMBER_ROWS
      : TEAM_MEMBER_ROWS.filter(
          (row) =>
            row.name.toLowerCase().includes(q) ||
            row.email.toLowerCase().includes(q),
        );
    return groupTeamMembersBySection(base);
  }, [query]);

  const sectionsWithVisualIndex = useMemo(() => {
    let visualIndex = 0;
    return sections.map((block) => ({
      ...block,
      rows: block.rows.map((row) => ({
        row,
        visualIndex: visualIndex++,
      })),
    }));
  }, [sections]);

  const sectionShellStyle = useMemo(
    () => teamMemberSectionShellStyle(spacing),
    [spacing],
  );

  useEffect(() => {
    if (!locateOffsetsRef) return;
    locateOffsetsRef.current = {};
    registeredLocateKeys.current = new Set();
    dataListOffsetY.current = 0;
  }, [locateOffsetsRef, query, sectionsWithVisualIndex]);

  const registerLocateOffset = (name: string, layoutY: number) => {
    if (!locateOffsetsRef || query.trim()) return;
    const key = teamMemberLocateKey(name);
    if (registeredLocateKeys.current.has(key)) return;
    registeredLocateKeys.current.add(key);
    locateOffsetsRef.current[key] = dataListOffsetY.current + layoutY;
  };

  return (
    <View
      collapsable={false}
      onLayout={(event) => {
        dataListOffsetY.current = event.nativeEvent.layout.y;
      }}
    >
      <EgDataList sceneContentInset={sceneInset} rowGap={sectionGroupGap}>
        {sectionsWithVisualIndex.map((block) => (
          <View key={block.bucket} style={sectionShellStyle}>
            <TeamMemberListSectionHeader
              bucket={block.bucket}
              label={t(teamMemberSectionTitleKey(block.bucket))}
            />
            <EgDataList sceneContentInset={0} rowGap={teamCenterDataListRowGap(spacing)}>
              {block.rows.map(({ row, visualIndex }) => {
                const displayTags = memberRowDisplayTags(row.tags, block.bucket);
                const colorIndex = teamMemberDisplayColorIndex(visualIndex, row.colorIndex);
                return (
                  <View
                    key={row.id}
                    collapsable={false}
                    onLayout={(event) => {
                      registerLocateOffset(row.name, event.nativeEvent.layout.y);
                    }}
                  >
                    <TeamCenterDetailDataListRow
                      testID={`team-member-row-${row.id}`}
                      accessibilityLabel={row.name}
                      primary={row.name}
                      tag={
                        displayTags.length > 0 ? (
                          <TeamCenterMemberTags tags={displayTags} />
                        ) : undefined
                      }
                      subSegmentB={maskEmail(row.email)}
                      trailing={null}
                      lead={
                        <MemberAvatarLead
                          name={row.name}
                          colorIndex={colorIndex}
                          active={row.active}
                        />
                      }
                      onPress={() => undefined}
                    />
                  </View>
                );
              })}
            </EgDataList>
          </View>
        ))}
      </EgDataList>
    </View>
  );
}