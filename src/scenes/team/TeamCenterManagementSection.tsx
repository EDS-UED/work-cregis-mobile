import { useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { TeamCenterManagementGridCell } from '@/scenes/team/TeamCenterManagementGridCell';
import { TEAM_CENTER_MANAGEMENT_GRID_ITEMS } from '@/scenes/team/teamCenterManagementGridItems';
import {
  TEAM_CENTER_MANAGEMENT_GRID_EG_ICON_SIZE,
  TEAM_CENTER_MANAGEMENT_GRID_OUTER_GAP,
  TEAM_CENTER_MANAGEMENT_TITLE_GRID_GAP,
} from '@/scenes/team/teamCenterEgItemLayout';
import { useNavigateTeamCenterDetail } from '@/scenes/team/useNavigateTeamCenterDetail';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

const GRID_COLUMNS = 2;

type TeamCenterManagementSectionProps = {
  onOpenRolesSheet: () => void;
};

/** 团队中心 · 「团队管理」— 双列灰底卡片。 */
export function TeamCenterManagementSection({
  onOpenRolesSheet,
}: TeamCenterManagementSectionProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [gridWidth, setGridWidth] = useState(0);

  const gridGap = edsPx(spacing[TEAM_CENTER_MANAGEMENT_GRID_OUTER_GAP]);
  const sceneInset = edsSceneContentInset(spacing);
  const estimatedGridWidth = useMemo(
    () => windowWidth - sceneInset * 2,
    [sceneInset, windowWidth],
  );

  const resolvedGridWidth = gridWidth > 0 ? gridWidth : estimatedGridWidth;
  const cellWidth =
    (resolvedGridWidth - gridGap * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          gap: edsPx(spacing[TEAM_CENTER_MANAGEMENT_TITLE_GRID_GAP]),
          marginBottom: edsPx(spacing['spacing-4']),
        },
        grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: gridGap,
        },
      }),
    [gridGap, spacing],
  );

  const iconSize = TEAM_CENTER_MANAGEMENT_GRID_EG_ICON_SIZE;
  const navigateDetail = useNavigateTeamCenterDetail();

  const rows = useMemo(
    () =>
      TEAM_CENTER_MANAGEMENT_GRID_ITEMS.map((item) => {
        const label = t(item.labelKey);
        return {
          ...item,
          label,
          icon: (
            <EgSymbol
              name={item.symbol}
              mode={mode}
              size={iconSize}
              strokeColorToken="stroke-decor"
              accessibilityLabel=""
            />
          ),
        };
      }),
    [iconSize, mode, t],
  );

  return (
    <View style={styles.section}>
      <SceneText variant="title">{t('team.sectionManagement')}</SceneText>
      <View
        style={styles.grid}
        onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
      >
        {rows.map((row) => {
          const item = TEAM_CENTER_MANAGEMENT_GRID_ITEMS.find(
            (entry) => entry.testID === row.testID,
          );
          const onPress =
            item && 'action' in item && item.action === 'rolesSheet'
              ? onOpenRolesSheet
              : item && 'detailId' in item
                ? () => navigateDetail(item.detailId)
                : undefined;
          return (
            <TeamCenterManagementGridCell
              key={row.testID}
              testID={row.testID}
              width={cellWidth}
              label={row.label}
              onPress={onPress}
              accessibilityLabel={row.label}
              icon={row.icon}
            />
          );
        })}
      </View>
    </View>
  );
}