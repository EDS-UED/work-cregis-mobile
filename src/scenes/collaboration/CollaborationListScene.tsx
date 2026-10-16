import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SceneCard } from '@/scenes/shared/SceneCard';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import type { CollaborationStackParamList } from '@/navigation/types';
import { useCollaborationStore, type CollaborationItem } from '@/store';

type Props = NativeStackScreenProps<CollaborationStackParamList, 'CollaborationList'>;

function collaborationTaskTitle(t: (key: string, opts?: { id: string }) => string, item: CollaborationItem) {
  return item.kind === 'approval'
    ? t('scenes.collaborationMockApproval', { id: item.id })
    : t('scenes.collaborationMockSigning', { id: item.id });
}

function collaborationStatusLabel(
  t: (key: string) => string,
  status: CollaborationItem['status'],
) {
  if (status === 'approved') return t('scenes.collaborationStatusApproved');
  if (status === 'rejected') return t('scenes.collaborationStatusRejected');
  return t('scenes.collaborationStatusPending');
}

export function CollaborationListScene({ navigation }: Props) {
  const { t } = useTranslation();
  const items = useCollaborationStore((state) => state.items);

  return (
    <SceneScaffold title={t('scenes.collaborationTitle')} subtitle={t('scenes.collaborationSubtitle')}>
      {items.map((item) => {
        const title = collaborationTaskTitle(t, item);
        return (
          <SceneCard
            key={item.id}
            title={title}
            onPress={() => navigation.navigate('CollaborationDetail', { id: item.id, title })}
          >
            <SceneText variant="body">{collaborationStatusLabel(t, item.status)}</SceneText>
          </SceneCard>
        );
      })}
    </SceneScaffold>
  );
}
