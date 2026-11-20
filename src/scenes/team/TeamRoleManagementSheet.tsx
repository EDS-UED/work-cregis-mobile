import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { StackNavigationProp } from '@react-navigation/stack';

import { EgItem, EgItemGroup } from '@/eds/item';
import { EgSheets } from '@/eds/sheets';
import type { HomeStackParamList } from '@/navigation/types';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

type TeamRoleManagementSheetProps = {
  visible: boolean;
  onDismiss: () => void;
  navigation: StackNavigationProp<HomeStackParamList, 'TeamCenter'>;
};

/** 角色入口 · EgSheets 仅 `adaptive` 档（两行 EgItem 收高）· 无 bottom action。 */
export function TeamRoleManagementSheet({
  visible,
  onDismiss,
  navigation,
}: TeamRoleManagementSheetProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const sheetContentStyle = useMemo(
    () => ({
      paddingHorizontal: edsPx(spacing['spacing-0']),
    }),
    [spacing],
  );

  const openDetail = useCallback(
    (id: 'rolesManagement' | 'appMarketRolesManagement') => {
      onDismiss();
      navigation.navigate('TeamCenterDetail', { id });
    },
    [navigation, onDismiss],
  );

  return (
    <EgSheets
      visible={visible}
      onDismiss={onDismiss}
      mode={mode}
      detents={['adaptive']}
      initialDetent="adaptive"
      title={t('team.roles')}
      showTitle
      showRight
      dismissible
      showActions={false}
      contentStyle={sheetContentStyle}
    >
      <EgItemGroup mode={mode}>
        <EgItem
          testID="team-role-sheet-team-roles"
          mode={mode}
          label={t('team.roleSheetTeamRoles')}
          showChevron
          onPress={() => openDetail('rolesManagement')}
          showDivider={false}
          accessibilityLabel={t('team.roleSheetTeamRoles')}
        />
        <EgItem
          testID="team-role-sheet-app-market-roles"
          mode={mode}
          label={t('team.roleSheetAppMarketRoles')}
          showChevron
          onPress={() => openDetail('appMarketRolesManagement')}
          showDivider={false}
          accessibilityLabel={t('team.roleSheetAppMarketRoles')}
        />
      </EgItemGroup>
    </EgSheets>
  );
}