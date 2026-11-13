import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamCenterMenuBlockDivider } from '@/scenes/team/TeamCenterMenuBlockDivider';
import { TeamCenterMenuRow } from '@/scenes/team/TeamCenterMenuRow';
import { TeamCenterPageShotHost } from '@/scenes/team/TeamCenterPageShotHost';
import { TeamCenterPlanCard } from '@/scenes/team/TeamCenterPlanCard';
import {
  teamCenterDataListGroupStyle,
  teamCenterDataListSectionStyle,
} from '@/scenes/team/teamCenterDataListLayout';
import { edsPx } from '@/utils/edsTheme';

/** 团队中心正文 · 套餐卡 + 三组 DataList（块间分割线 · 块内无分割）。 */
export function TeamCenterContent() {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: edsPx(spacing['spacing-6']),
        },
        dataList: teamCenterDataListSectionStyle(spacing),
        group: teamCenterDataListGroupStyle(spacing),
      }),
    [spacing],
  );

  return (
    <TeamCenterPageShotHost>
      <View style={styles.root}>
        <TeamCenterPlanCard />

        <View style={styles.dataList}>
          <View style={styles.group}>
            <TeamCenterMenuRow
              testID="team-row-team-security"
              label={t('team.teamSecurity')}
              subtitle={t('team.teamSecuritySubtitle')}
              onPress={() => undefined}
            />
          </View>

          <TeamCenterMenuBlockDivider />

          <View style={styles.group}>
            <TeamCenterMenuRow
              testID="team-row-member-management"
              label={t('team.memberManagement')}
              subtitle={t('team.memberManagementSubtitle')}
              onPress={() => undefined}
            />
            <TeamCenterMenuRow
              testID="team-row-role-management"
              label={t('team.roleManagement')}
              subtitle={t('team.roleManagementSubtitle')}
              onPress={() => undefined}
            />
            <TeamCenterMenuRow
              testID="team-row-team-api"
              label={t('team.teamApi')}
              subtitle={t('team.teamApiSubtitle')}
              onPress={() => undefined}
            />
            <TeamCenterMenuRow
              testID="team-row-webhook"
              label={t('team.webhook')}
              subtitle={t('team.webhookSubtitle')}
              onPress={() => undefined}
            />
          </View>

          <TeamCenterMenuBlockDivider />

          <View style={styles.group}>
            <TeamCenterMenuRow
              testID="team-row-team-account"
              label={t('team.teamAccount')}
              subtitle={t('team.viewTeamAccount')}
              onPress={() => undefined}
            />
            <TeamCenterMenuRow
              testID="team-row-fee-records"
              label={t('team.feeRecords')}
              subtitle={t('team.feeRecordsSubtitle')}
              onPress={() => undefined}
            />
            <TeamCenterMenuRow
              testID="team-row-gas-payment-records"
              label={t('team.gasPaymentRecords')}
              subtitle={t('team.gasPaymentRecordsSubtitle')}
              onPress={() => undefined}
            />
            <TeamCenterMenuRow
              testID="team-row-order-management"
              label={t('team.orderManagement')}
              subtitle={t('team.orderManagementSubtitle')}
              onPress={() => undefined}
            />
          </View>
        </View>
      </View>
    </TeamCenterPageShotHost>
  );
}
