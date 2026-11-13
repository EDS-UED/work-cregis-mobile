import { useLayoutEffect, type ComponentProps } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { CollaborationListScene } from '@/scenes/collaboration/CollaborationListScene';
import { useCollaborationMainScreenOptions } from '@/scenes/collaboration/useCollaborationMainScreenOptions';
import type { CollaborationStackParamList } from '@/navigation/types';

type CollaborationListNav = StackNavigationProp<
  CollaborationStackParamList,
  'CollaborationList'
>;

export function CollaborationMainScreen(props: ComponentProps<typeof CollaborationListScene>) {
  const navigation = useNavigation<CollaborationListNav>();
  const screenOptions = useCollaborationMainScreenOptions();

  useLayoutEffect(() => {
    navigation.setOptions(screenOptions);
  }, [navigation, screenOptions]);

  return <CollaborationListScene {...props} />;
}
