import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamCenterMenuRow } from '@/scenes/team/TeamCenterMenuRow';
import { TeamCenterMenuSectionCard } from '@/scenes/team/TeamCenterMenuSectionCard';
import { TeamCenterPlanCardFace } from '@/scenes/team/TeamCenterPlanCard';
import { useNavigateTeamCenterDetail } from '@/scenes/team/useNavigateTeamCenterDetail';
import { edsPx } from '@/utils/edsTheme';

/** 团队订阅子页 · 套餐卡 + 安全 / 管理分组菜单（对齐对比稿 team-center-card）。 */
export function TeamCenterSubscriptionDetailBody() {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();
  const navigateDetail = useNavigateTeamCenterDetail();

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
    <View style={styles.stack}>
      <View style={styles.planBlock}>
        <TeamCenterPlanCardFace />
      </View>

      <TeamCenterMenuSectionCard
        sectionTitle={t('team.sectionSecurity')}
        cardTone="shallow"
      >
        <TeamCenterMenuRow
          testID="team-subscription-row-security"
          label={t('team.teamSecurity')}
          subtitle={t('team.teamSecuritySubtitle')}
          onPress={() => navigateDetail('security')}
          inCardShell
        />
      </TeamCenterMenuSectionCard>

      <TeamCenterMenuSectionCard
        sectionTitle={t('team.sectionAdmin')}
        cardTone="shallow"
      >
        <TeamCenterMenuRow
          testID="team-subscription-row-members"
          label={t('team.members')}
          subtitle={t('team.memberManagementSubtitle')}
          onPress={() => navigateDetail('members')}
          inCardShell
        />
        <TeamCenterMenuRow
          testID="team-subscription-row-roles"
          label={t('team.roles')}
          subtitle={t('team.roleManagementSubtitle')}
          onPress={() => navigateDetail('rolesManagement')}
          inCardShell
        />
        <TeamCenterMenuRow
          testID="team-subscription-row-team-api"
          label={t('team.teamApi')}
          subtitle={t('team.teamApiSubtitle')}
          onPress={() => undefined}
          inCardShell
        />
        <TeamCenterMenuRow
          testID="team-subscription-row-webhook"
          label={t('team.webhook')}
          subtitle={t('team.webhookSubtitle')}
          onPress={() => undefined}
          inCardShell
        />
      </TeamCenterMenuSectionCard>
    </View>
  );
}