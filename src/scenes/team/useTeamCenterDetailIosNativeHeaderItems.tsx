import { useCallback } from 'react';
import { View } from 'react-native';
import type {
  NativeStackHeaderItem,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {
  egNavBarNativeStackHeaderGlassItem,
  shouldUseEgNavBarNativeStack,
} from '@/eds/nav-bar';

import type { TeamCenterDetailId } from '@/scenes/team/teamCenterDetail';
import { TeamCenterDetailNavTrailing } from '@/scenes/team/detail/TeamCenterDetailNavParts';

function teamCenterDetailHasNavTrailing(detailId: TeamCenterDetailId): boolean {
  return (
    detailId === 'memberManagement' ||
    detailId === 'roleManagement' ||
    detailId === 'addressBook' ||
    detailId === 'teamInfo'
  );
}

export function useTeamCenterDetailIosNativeHeaderItems() {
  return useCallback(
    (
      detailId: TeamCenterDetailId,
    ): Pick<
      NativeStackNavigationOptions,
      'unstable_headerLeftItems' | 'unstable_headerRightItems'
    > => {
      if (!shouldUseEgNavBarNativeStack()) {
        return {};
      }

      if (!teamCenterDetailHasNavTrailing(detailId)) {
        return {
          unstable_headerRightItems: (): NativeStackHeaderItem[] => [],
        };
      }

      const trailing = <TeamCenterDetailNavTrailing detailId={detailId} />;

      return {
        unstable_headerRightItems: (): NativeStackHeaderItem[] => [
          egNavBarNativeStackHeaderGlassItem(
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>{trailing}</View>,
          ),
        ],
      };
    },
    [],
  );
}