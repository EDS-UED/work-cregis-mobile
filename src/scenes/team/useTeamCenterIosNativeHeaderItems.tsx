import { useMemo } from 'react';
import type {
  NativeStackHeaderItem,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {
  egNavBarNativeStackHeaderGlassItem,
  shouldUseEgNavBarNativeStack,
} from '@/eds/nav-bar';

import { TeamCenterNavSwitcherButton } from '@/scenes/team/TeamCenterNavSwitcherButton';

export function useTeamCenterIosNativeHeaderItems(
  onOpenSwitcher: () => void,
): Pick<NativeStackNavigationOptions, 'unstable_headerRightItems'> {
  return useMemo(() => {
    if (!shouldUseEgNavBarNativeStack()) {
      return {};
    }

    return {
      unstable_headerRightItems: (): NativeStackHeaderItem[] => [
        egNavBarNativeStackHeaderGlassItem(
          <TeamCenterNavSwitcherButton onPress={onOpenSwitcher} />,
        ),
      ],
    };
  }, [onOpenSwitcher]);
}