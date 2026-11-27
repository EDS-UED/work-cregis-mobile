import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { EgDataList } from '@/eds/data-list';
import type { HomeStackParamList } from '@/navigation/types';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamCenterMenuRow } from '@/scenes/team/TeamCenterMenuRow';
import {
  TEAM_CENTER_MENU_ICONS,
  TEAM_CENTER_MENU_ITEM_ORDER,
  TEAM_CENTER_MENU_LABEL_KEYS,
  TEAM_CENTER_MENU_TEST_IDS,
} from '@/scenes/team/teamCenterMenuCatalog';
import { TeamCenterPageShotHost } from '@/scenes/team/TeamCenterPageShotHost';
import { TeamCenterPlanCard } from '@/scenes/team/TeamCenterPlanCard';
import { teamCenterDataListRowGap } from '@/scenes/team/teamCenterDataListLayout';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

type TeamCenterNav = StackNavigationProp<HomeStackParamList, 'TeamCenter'>;

/** 团队中心正文 · 套餐卡 + 菜单 DataList（仅主标题 · 无副文本）。 */
export function TeamCenterContent() {
  const { t } = useTranslation();
  const navigation = useNavigation<TeamCenterNav>();
  const { spacing } = useEdsTheme();
  const sceneInset = edsSceneContentInset(spacing);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: edsPx(spacing['spacing-7']),
        },
      }),
    [spacing],
  );

  return (
    <TeamCenterPageShotHost>
      <View style={styles.root}>
        <TeamCenterPlanCard />

        <EgDataList sceneContentInset={sceneInset} rowGap={teamCenterDataListRowGap(spacing)}>
          {TEAM_CENTER_MENU_ITEM_ORDER.map((id) => (
            <TeamCenterMenuRow
              key={id}
              testID={TEAM_CENTER_MENU_TEST_IDS[id]}
              icon={TEAM_CENTER_MENU_ICONS[id]}
              label={t(TEAM_CENTER_MENU_LABEL_KEYS[id])}
              onPress={() => navigation.navigate('TeamCenterDetail', { id })}
            />
          ))}
        </EgDataList>
      </View>
    </TeamCenterPageShotHost>
  );
}