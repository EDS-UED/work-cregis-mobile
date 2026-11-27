import { useMemo } from 'react';
import { View } from 'react-native';
import type {
  NativeStackHeaderItem,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {
  egNavBarNativeStackHeaderGlassItem,
  shouldUseEgNavBarNativeStack,
} from '@/eds/nav-bar';

import {
  WalletNavLeading,
  WalletNavNoticeGlassNav,
} from '@/scenes/assets/WalletNavParts';
import { edsPx } from '@/utils/edsTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';

export function useWalletIosNativeHeaderItems(): Pick<
  NativeStackNavigationOptions,
  'unstable_headerLeftItems' | 'unstable_headerRightItems'
> {
  const { spacing } = useEdsTheme();
  const itemGap = edsPx(spacing['spacing-2-5']);

  return useMemo(() => {
    if (!shouldUseEgNavBarNativeStack()) {
      return {};
    }

    const row = { flexDirection: 'row' as const, alignItems: 'center' as const, gap: itemGap };

    return {
      unstable_headerLeftItems: (): NativeStackHeaderItem[] => [
        egNavBarNativeStackHeaderGlassItem(
          <View style={row}>
            <WalletNavLeading />
          </View>,
        ),
      ],
      unstable_headerRightItems: (): NativeStackHeaderItem[] => [
        egNavBarNativeStackHeaderGlassItem(
          <View style={row}>
            <WalletNavNoticeGlassNav />
          </View>,
        ),
      ],
    };
  }, [itemGap]);
}
