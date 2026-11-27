import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EgDataList } from '@/eds/data-list';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamCenterMenuBlockDivider } from '@/scenes/team/TeamCenterMenuBlockDivider';
import { TeamCenterDetailDataListRow } from '@/scenes/team/detail/TeamCenterDetailDataListRow';
import {
  partitionTeamRoleRows,
  TEAM_ROLE_ROWS,
  teamRoleInitialSwitchState,
  type TeamRoleRow,
} from '@/scenes/team/detail/teamRoleDetailMock';
import { teamCenterDataListRowGap } from '@/scenes/team/teamCenterDataListLayout';
import { edsSceneContentInset } from '@/utils/edsTheme';
import { formatMobileDate } from '@/utils/formatMobileDateTime';

type TeamRolesDetailContentProps = {
  query?: string;
};

/** 角色管理 · 超级管理员/管理员置顶 · 模块分割线 · 行尾 `EgSwitch`。 */
export function TeamRolesDetailContent({ query = '' }: TeamRolesDetailContentProps) {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();
  const sceneInset = edsSceneContentInset(spacing);
  const [enabledById, setEnabledById] = useState(teamRoleInitialSwitchState);

  const { pinned, others } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = !q
      ? TEAM_ROLE_ROWS
      : TEAM_ROLE_ROWS.filter((row) => {
          const title = t(row.nameKey).toLowerCase();
          return title.includes(q) || row.creatorName.toLowerCase().includes(q);
        });
    return partitionTeamRoleRows(filtered);
  }, [query, t]);

  const handleSwitchChange = useCallback((id: string, value: boolean) => {
    setEnabledById((prev) => ({ ...prev, [id]: value }));
  }, []);

  const renderRow = useCallback(
    (row: TeamRoleRow) => {
      const title = t(row.nameKey);
      return (
        <TeamCenterDetailDataListRow
          key={row.id}
          testID={`team-role-row-${row.id}`}
          accessibilityLabel={title}
          primary={title}
          subSegmentA={row.creatorName}
          subSegmentSymbol={{
            name: row.creatorName,
            colorIndex: row.creatorColorIndex,
          }}
          subSegmentB={t('team.roleCreatedSuffix', {
            date: formatMobileDate(row.createdAt),
          })}
          boldSubA
          trailing="switch"
          switchValue={enabledById[row.id] ?? false}
          onSwitchChange={(value) => handleSwitchChange(row.id, value)}
          onPress={() => undefined}
        />
      );
    },
    [enabledById, handleSwitchChange, t],
  );

  const showDivider = pinned.length > 0 && others.length > 0;

  return (
    <EgDataList sceneContentInset={sceneInset} rowGap={teamCenterDataListRowGap(spacing)}>
      {pinned.map(renderRow)}
      {showDivider ? <TeamCenterMenuBlockDivider /> : null}
      {others.map(renderRow)}
    </EgDataList>
  );
}