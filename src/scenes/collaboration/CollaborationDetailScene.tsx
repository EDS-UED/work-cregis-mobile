import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SceneCard } from '@/scenes/shared/SceneCard';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import type { CollaborationStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<CollaborationStackParamList, 'CollaborationDetail'>;

export function CollaborationDetailScene({ route }: Props) {
  const { t } = useTranslation();

  return (
    <SceneScaffold title={t('scenes.detailTitle')} subtitle={route.params.title}>
      <SceneCard
        title={route.params.id}
        inspect={{
          label: 'CollaborationDetailPanel',
          motionScene: 'motion-page',
          motionPreset: 'timing.navigationPush',
          layoutLines: ['width: fill', 'padding: var(--spacing-4)'],
          styleLines: ['background: var(--surface-primary)'],
        }}
      >
        <Text>Mock detail content</Text>
      </SceneCard>
    </SceneScaffold>
  );
}
