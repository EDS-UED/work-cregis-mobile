import { useCallback, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { HomeStackParamList } from '@/navigation/types';
import { TeamRoleManagementSheet } from '@/scenes/team/TeamRoleManagementSheet';
import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';
import { useHomeStore } from '@/store';
import { TeamCenterContent } from '@/scenes/team/TeamCenterContent';
import { TeamCenterNavSwitcherButton } from '@/scenes/team/TeamCenterNavSwitcherButton';
import { TeamSwitcherSheet } from '@/scenes/team/TeamSwitcherSheet';
import { useTeamCenterIosNativeHeaderItems } from '@/scenes/team/useTeamCenterIosNativeHeaderItems';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';

export function TeamCenterScene() {
  const navigation =
    useNavigation<StackNavigationProp<HomeStackParamList, 'TeamCenter'>>();
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [rolesSheetOpen, setRolesSheetOpen] = useState(false);

  const openSwitcher = useCallback(() => setSwitcherOpen(true), []);
  const closeSwitcher = useCallback(() => setSwitcherOpen(false), []);
  const openRolesSheet = useCallback(() => setRolesSheetOpen(true), []);
  const closeRolesSheet = useCallback(() => setRolesSheetOpen(false), []);
  const iosNavRight = useTeamCenterIosNativeHeaderItems(openSwitcher);

  useLayoutEffect(() => {
    if (!nativeNavBar) {
      return;
    }
    navigation.setOptions(iosNavRight as object);
  }, [iosNavRight, nativeNavBar, navigation]);

  return (
    <>
      <SceneScaffold
        title={teamDisplayName}
        showNavBack
        showNavTitle={false}
        pageBackground="default"
        overlayNavTrailing={
          nativeNavBar ? undefined : (
            <TeamCenterNavSwitcherButton onPress={openSwitcher} />
          )
        }
      >
        <TeamCenterContent onOpenRolesSheet={openRolesSheet} />
      </SceneScaffold>
      <TeamSwitcherSheet visible={switcherOpen} onDismiss={closeSwitcher} />
      <TeamRoleManagementSheet
        visible={rolesSheetOpen}
        onDismiss={closeRolesSheet}
        navigation={navigation}
      />
    </>
  );
}
