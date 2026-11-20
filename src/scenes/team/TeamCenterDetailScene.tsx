import type { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import type { HomeStackParamList } from '@/navigation/types';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { teamCenterDetailMeta } from '@/scenes/team/teamCenterDetail';
import { TeamCenterSubscriptionDetailBody } from '@/scenes/team/TeamCenterSubscriptionDetailBody';

type Props = StackScreenProps<HomeStackParamList, 'TeamCenterDetail'>;

export function TeamCenterDetailScene({ route }: Props) {
  const { t } = useTranslation();
  const { id } = route.params;
  const meta = teamCenterDetailMeta(id);

  return (
    <SceneScaffold
      title={t(meta.titleKey)}
      showNavBack
      pageBackground={meta.pageBackground ?? 'default'}
    >
      {id === 'subscription' ? <TeamCenterSubscriptionDetailBody /> : null}
    </SceneScaffold>
  );
}