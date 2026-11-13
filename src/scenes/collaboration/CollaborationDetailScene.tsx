import { useTranslation } from 'react-i18next';
import type { StackScreenProps } from '@react-navigation/stack';

import { SceneCard } from '@/scenes/shared/SceneCard';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import type { CollaborationStackParamList } from '@/navigation/types';

type Props = StackScreenProps<CollaborationStackParamList, 'CollaborationDetail'>;

export function CollaborationDetailScene({ route }: Props) {
  const { t } = useTranslation();

  return (
    <SceneScaffold
      title={t('scenes.detailTitle')}
      subtitle={route.params.title}
      showNavBack
    >
      <SceneCard title={route.params.id}>
        <SceneText variant="body">{t('scenes.detailMock')}</SceneText>
      </SceneCard>
    </SceneScaffold>
  );
}
