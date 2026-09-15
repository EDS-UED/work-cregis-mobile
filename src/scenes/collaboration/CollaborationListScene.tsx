import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SceneCard } from '@/scenes/shared/SceneCard';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import type { CollaborationStackParamList } from '@/navigation/types';
import { useCollaborationStore } from '@/store';

type Props = NativeStackScreenProps<CollaborationStackParamList, 'CollaborationList'>;

export function CollaborationListScene({ navigation }: Props) {
  const { t } = useTranslation();
  const items = useCollaborationStore((state) => state.items);

  return (
    <SceneScaffold title={t('scenes.collaborationTitle')} subtitle={t('scenes.collaborationSubtitle')}>
      {items.map((item) => (
        <SceneCard
          key={item.id}
          title={item.title}
          onPress={() =>
            navigation.navigate('CollaborationDetail', { id: item.id, title: item.title })
          }
          inspect={{
            label: 'CollaborationListItem',
            motionScene: 'motion-page',
            motionPreset: 'timing.navigationPush',
            layoutLines: ['display: flex', 'padding: var(--spacing-4)'],
            styleLines: ['border-radius: var(--radius-md)'],
          }}
        >
          <Text>{item.status}</Text>
        </SceneCard>
      ))}
    </SceneScaffold>
  );
}
