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
            sectionTitle={t('team.sectionSecurity')}
            cardTone={menuCardTone}
          >
            <TeamCenterMenuRow
              testID="team-row-team-security"
              label={t('team.teamSecurity')}
              subtitle={t('team.teamSecuritySubtitle')}
              onPress={() => undefined}
              inCardShell
            />
          </CompareTeamCenterMenuSectionCard>

          <CompareTeamCenterMenuSectionCard
            sectionTitle={t('team.sectionAdmin')}
            cardTone={menuCardTone}
          >
            <TeamCenterMenuRow
              testID="team-row-member-management"
              label={t('team.members')}
              subtitle={t('team.memberManagementSubtitle')}
              onPress={() => undefined}
              inCardShell
            />
            <TeamCenterMenuRow
              testID="team-row-role-management"
              label={t('team.roles')}
              subtitle={t('team.roleManagementSubtitle')}
              onPress={() => undefined}
              inCardShell
            />
            <TeamCenterMenuRow
              testID="team-row-team-api"
              label={t('team.teamApi')}
              subtitle={t('team.teamApiSubtitle')}
              onPress={() => undefined}
              inCardShell
            />
            <TeamCenterMenuRow
              testID="team-row-webhook"
              label={t('team.webhook')}
              subtitle={t('team.webhookSubtitle')}
              onPress={() => undefined}
              inCardShell
            />
          </CompareTeamCenterMenuSectionCard>

          <CompareTeamCenterMenuSectionCard
            sectionTitle={t('team.sectionTeamAccount')}
            cardTone={menuCardTone}
          >
            <TeamCenterMenuRow
              testID="team-row-team-account"
              label={t('team.teamAccount')}
              subtitle={t('team.viewTeamAccount')}
              onPress={() => undefined}
              inCardShell
            />
            <TeamCenterMenuRow
              testID="team-row-fee-records"
              label={t('team.feeRecords')}
              subtitle={t('team.feeRecordsSubtitle')}
              onPress={() => undefined}
              inCardShell
            />
            <TeamCenterMenuRow
              testID="team-row-gas-payment-records"
              label={t('team.gasPaymentRecords')}
              subtitle={t('team.gasPaymentRecordsSubtitle')}
              onPress={() => undefined}
              inCardShell
            />
            <TeamCenterMenuRow
              testID="team-row-order-management"
              label={t('team.orderManagement')}
              subtitle={t('team.orderManagementSubtitle')}
              onPress={() => undefined}
              inCardShell
            />
          </CompareTeamCenterMenuSectionCard>
      </View>
    </CompareTeamCenterCardPageShotHost>
  );
}