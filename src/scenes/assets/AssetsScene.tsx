import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { SceneCard } from '@/scenes/shared/SceneCard';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { useAssetsStore } from '@/store';

export function AssetsScene() {
  const { t } = useTranslation();
  const totalBalance = useAssetsStore((state) => state.totalBalance);
  const assets = useAssetsStore((state) => state.assets);

  return (
    <SceneScaffold title={t('scenes.assetsTitle')} subtitle={t('scenes.assetsSubtitle')}>
      <SceneCard
        title={totalBalance}
        inspect={{
          label: 'AssetsSummary',
          motionScene: null,
          motionPreset: null,
          layoutLines: ['padding: var(--spacing-4)'],
          styleLines: ['background: var(--material-card-shallow)'],
        }}
      >
        {assets.map((asset) => (
          <Text key={asset.symbol}>{`${asset.symbol}  ${asset.balance}`}</Text>
        ))}
      </SceneCard>
    </SceneScaffold>
  );
}
