import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { HomeStackParamList } from '@/navigation/types';

export function useHomeStackNavigation() {
  return useNavigation<StackNavigationProp<HomeStackParamList>>();
}
