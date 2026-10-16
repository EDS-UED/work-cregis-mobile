import { useTranslation } from 'react-i18next';

import { SceneCard } from '@/scenes/shared/SceneCard';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { useAssetsStore } from '@/store';

export function AssetsScene() {
  const { t } = useTranslation();
  const totalBalance = useAssetsStore((state) => state.totalBalance);
  const assets = useAssetsStore((state) => state.assets);

  return (
    <SceneScaffold title={t('scenes.assetsTitle')} subtitle={t('scenes.assetsSubtitle')}>
      <SceneCard title={t('scenes.assetsTotalLabel')}>
        <SceneText variant="display">{totalBalance}</SceneText>
      </SceneCard>
      {assets.map((asset) => (
        <SceneCard key={asset.symbol} title={asset.symbol}>
          <SceneText variant="bodySemibold">{asset.balance}</SceneText>
        </SceneCard>
      ))}
    </SceneScaffold>
  );
}
