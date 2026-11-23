import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import type { CompareTeamCenterCardVariant } from '@/scenes/compare/team-center-card/compareTeamCenterCardVariant';
import {
  CompareTeamCenterMenuSectionCard,
  type CompareTeamCenterMenuCardTone,
} from '@/scenes/compare/team-center-card/CompareTeamCenterMenuSectionCard';
import { CompareTeamCenterCardPageShotHost } from '@/scenes/compare/team-center-card/CompareTeamCenterCardPageShotHost';
import { TeamCenterMenuRow } from '@/scenes/team/TeamCenterMenuRow';
import {
  TEAM_CENTER_MENU_ICONS,
  TEAM_CENTER_MENU_ITEM_ORDER,
  TEAM_CENTER_MENU_LABEL_KEYS,
  TEAM_CENTER_MENU_TEST_IDS,
} from '@/scenes/team/teamCenterMenuCatalog';
import { TeamCenterPlanCard } from '@/scenes/team/TeamCenterPlanCard';
import { edsPx } from '@/utils/edsTheme';

type CompareTeamCenterCardContentProps = {
  variant: CompareTeamCenterCardVariant;
};

const MENU_CARD_TONE: Record<
  CompareTeamCenterCardVariant,
  CompareTeamCenterMenuCardTone
> = {
  traditional: 'page',
  gray: 'shallow',
};

/** 对比页 · 团队中心正文快照。 */
export function CompareTeamCenterCardContent({
  variant,
}: CompareTeamCenterCardContentProps) {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();
  const menuCardTone = MENU_CARD_TONE[variant];
  const lastId = TEAM_CENTER_MENU_ITEM_ORDER.at(-1);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        /** 与个人中心 `SceneScaffold` 内容区一致：`gap-3` + 各块 `marginBottom-4`。 */
        stack: {
          gap: edsPx(spacing['spacing-3']),
        },
        planBlock: {
          marginBottom: edsPx(spacing['spacing-4']),
        },
      }),
    [spacing],
  );

  return (
    <CompareTeamCenterCardPageShotHost>
      <View style={styles.stack}>
        <View style={styles.planBlock}>
          <TeamCenterPlanCard />
        </View>

        <CompareTeamCenterMenuSectionCard
          sectionTitle={t('team.sectionManagement')}
          cardTone={menuCardTone}
        >
          {TEAM_CENTER_MENU_ITEM_ORDER.map((id) => (
            <TeamCenterMenuRow
              key={id}
              testID={TEAM_CENTER_MENU_TEST_IDS[id]}
              icon={TEAM_CENTER_MENU_ICONS[id]}
              label={t(TEAM_CENTER_MENU_LABEL_KEYS[id])}
              onPress={() => undefined}
              inCardShell
              isLast={id === lastId}
            />
          ))}
        </CompareTeamCenterMenuSectionCard>
      </View>
    </CompareTeamCenterCardPageShotHost>
  );
}