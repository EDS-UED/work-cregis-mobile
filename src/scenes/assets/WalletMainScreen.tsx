import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { WalletScene } from '@/scenes/assets/WalletScene';
import { useWalletMainScreenOptions } from '@/scenes/assets/useWalletMainScreenOptions';
import type { AssetsStackParamList } from '@/navigation/types';

export function WalletMainScreen() {
  const navigation = useNavigation<StackNavigationProp<AssetsStackParamList>>();
  const screenOptions = useWalletMainScreenOptions();

  useLayoutEffect(() => {
    navigation.setOptions(screenOptions);
  }, [navigation, screenOptions]);

  return <WalletScene />;
}
