import { useCallback, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgEdsAnimaPageShotTrigger } from '@/eds/page-shot';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

import {
  TeamCenterPlanCardContent,
  useTeamCenterPlanCardShellStyle,
} from '@/scenes/team/TeamCenterPlanCardContent';
import {
  getTeamPlanCardLastLayoutSize,
  setTeamPlanCardLastLayoutSize,
} from '@/scenes/team/teamPlanCardLayout';
import { TEAM_PLAN_PAGE_SHOT_ID } from '@/scenes/team/teamPlanPageShot';

function TeamCenterPlanCardFace() {
  const shellStyles = useTeamCenterPlanCardShellStyle();
  const [cardSize, setCardSize] = useState(getTeamPlanCardLastLayoutSize);

  const onCardLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setTeamPlanCardLastLayoutSize({ width, height });
    setCardSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  return (
    <View style={shellStyles.card} onLayout={onCardLayout}>
      <TeamCenterPlanCardContent width={cardSize.width} height={cardSize.height} />
    </View>
  );
}

/** 团队中心套餐卡 · 布局与样式独立于订阅根页；`morph` 仅负责飞行动效。 */
export function TeamCenterPlanCard() {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();

  return (
    <EgEdsAnimaPageShotTrigger
      id={TEAM_PLAN_PAGE_SHOT_ID}
      radius={edsPx(spacing['radius-md'])}
      stretch
      morph
      accessibilityLabel={t('team.subscription')}
    >
      <TeamCenterPlanCardFace />
    </EgEdsAnimaPageShotTrigger>
  );
}