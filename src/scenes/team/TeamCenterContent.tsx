import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamCenterAccountSection } from '@/scenes/team/TeamCenterAccountSection';
import { TeamCenterManagementSection } from '@/scenes/team/TeamCenterManagementSection';
import { TeamCenterPageShotHost } from '@/scenes/team/TeamCenterPageShotHost';
import { TEAM_CENTER_ACCOUNT_TO_MANAGEMENT_GAP } from '@/scenes/team/teamCenterEgItemLayout';
import { edsPx } from '@/utils/edsTheme';

type TeamCenterContentProps = {
  onOpenRolesSheet: () => void;
};

/** 团队中心正文 · 账户组 + 团队管理（布局对齐个人中心）。 */
export function TeamCenterContent({ onOpenRolesSheet }: TeamCenterContentProps) {
  const { spacing } = useEdsTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        stack: {
          gap: edsPx(spacing[TEAM_CENTER_ACCOUNT_TO_MANAGEMENT_GAP]),
        },
      }),
    [spacing],
  );

  return (
    <TeamCenterPageShotHost>
      <View style={styles.stack}>
        <TeamCenterAccountSection />
        <TeamCenterManagementSection onOpenRolesSheet={onOpenRolesSheet} />
      </View>
    </TeamCenterPageShotHost>
  );
}