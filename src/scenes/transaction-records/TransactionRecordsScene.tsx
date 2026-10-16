import { useTranslation } from 'react-i18next';

import { SceneScaffold } from '@/scenes/shared/SceneScaffold';

export function TransactionRecordsScene() {
  const { t } = useTranslation();

  return (
    <SceneScaffold
      title={t('scenes.transactionRecordsTitle')}
      subtitle={t('scenes.transactionRecordsSubtitle')}
    />
  );
}
