import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgButtonGlass } from '@/eds/button-glass';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import type { TeamCenterDetailId } from '@/scenes/team/teamCenterDetail';
import { edsPx } from '@/utils/edsTheme';

const glassIconDefaults = {
  kind: 'icon' as const,
  iconCount: 1 as const,
  size: 'md' as const,
};

type TeamCenterDetailNavTrailingProps = {
  detailId: TeamCenterDetailId;
};

/** 团队中心子页顶栏右区 · `EgButtonGlass`（与 Home / 钱包 / 通知一致）。 */
export function TeamCenterDetailNavTrailing({ detailId }: TeamCenterDetailNavTrailingProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const itemGap = edsPx(spacing['spacing-2-5']);

  if (detailId === 'memberManagement') {
    return (
      <EgButtonGlass
        {...glassIconDefaults}
        mode={mode}
        icon="eds-add"
        accessibilityLabel={t('team.memberAdd')}
        testID="team-detail-nav-member-add"
        onPress={() => undefined}
      />
    );
  }

  if (detailId === 'roleManagement') {
    return (
      <EgButtonGlass
        {...glassIconDefaults}
        mode={mode}
        icon="eds-add"
        accessibilityLabel={t('team.roleAdd')}
        testID="team-detail-nav-role-add"
        onPress={() => undefined}
      />
    );
  }

  if (detailId === 'addressBook') {
    return (
      <View style={[styles.row, { gap: itemGap }]}>
        <EgButtonGlass
          {...glassIconDefaults}
          mode={mode}
          icon="eds-filter"
          accessibilityLabel={t('team.addressFilter')}
          testID="team-detail-nav-address-filter"
          onPress={() => undefined}
        />
        <EgButtonGlass
          {...glassIconDefaults}
          mode={mode}
          icon="eds-add"
          accessibilityLabel={t('team.addressAdd')}
          testID="team-detail-nav-address-add"
          onPress={() => undefined}
        />
      </View>
    );
  }

  if (detailId === 'teamInfo') {
    const label = t('team.edit');
    return (
      <EgButtonGlass
        kind="text"
        label={label}
        size="md"
        mode={mode}
        accessibilityLabel={label}
        testID="team-detail-nav-team-info-edit"
        onPress={() => undefined}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});