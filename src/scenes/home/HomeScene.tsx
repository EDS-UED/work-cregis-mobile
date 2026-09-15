import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { SceneCard } from '@/scenes/shared/SceneCard';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { useHomeStore } from '@/store';

export function HomeScene() {
  const { t } = useTranslation();
  const pendingTasks = useHomeStore((state) => state.pendingTasks);
  const totalBalance = useHomeStore((state) => state.summaryLabel);

  return (
    <SceneScaffold title={t('scenes.homeTitle')} subtitle={t('scenes.homeSubtitle')}>
      <SceneCard
        title={t('tabs.assets')}
        inspect={{
          label: 'HomeSummaryCard',
          motionScene: null,
          motionPreset: null,
          layoutLines: ['padding: var(--spacing-4)', 'gap: var(--spacing-2)'],
          styleLines: ['background: var(--material-card-shallow)'],
        }}
      >
        <Text>{totalBalance}</Text>
        <Text>{`Pending tasks: ${pendingTasks}`}</Text>
      </SceneCard>
    </SceneScaffold>
  );
}
