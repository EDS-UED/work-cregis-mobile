import { useCallback, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { WalletScene } from '@/scenes/assets/WalletScene';
import { WalletNavTitle } from '@/scenes/assets/WalletNavTitle';
import { WalletSwitcherSheet } from '@/scenes/assets/WalletSwitcherSheet';
import { useWalletMainScreenOptions } from '@/scenes/assets/useWalletMainScreenOptions';
import type { AssetsStackParamList } from '@/navigation/types';
import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';

export function WalletMainScreen() {
  const navigation = useNavigation<StackNavigationProp<AssetsStackParamList>>();
  const screenOptions = useWalletMainScreenOptions();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const openSwitcher = useCallback(() => setSwitcherOpen(true), []);
  const closeSwitcher = useCallback(() => setSwitcherOpen(false), []);
  const nativeNavBar = shouldUseEgNavBarNativeStack();

  useLayoutEffect(() => {
    if (nativeNavBar) {
      navigation.setOptions({
        ...screenOptions,
        headerTitle: () => <WalletNavTitle onOpenSwitcher={openSwitcher} />,
      });
      return;
    }
    navigation.setOptions(screenOptions);
  }, [navigation, nativeNavBar, openSwitcher, screenOptions]);

  return (
    <>
      <WalletScene onOpenWalletSwitcher={openSwitcher} />
      <WalletSwitcherSheet visible={switcherOpen} onDismiss={closeSwitcher} />
    </>
  );
}