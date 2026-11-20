import { useCallback } from 'react';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

import type { HomeStackParamList } from '@/navigation/types';
import type { TeamCenterDetailId } from '@/scenes/team/teamCenterDetail';

export function useNavigateTeamCenterDetail() {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  return useCallback(
    (id: TeamCenterDetailId) => {
      navigation.navigate('TeamCenterDetail', { id });
    },
    [navigation],
  );
}