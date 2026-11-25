import { memo, useCallback, useState } from 'react';
import { View, type LayoutChangeEvent, type GestureResponderEvent } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgPageShotTrigger } from '@/eds/page-shot';
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
import { armTeamPlanPageShotCovering } from '@/scenes/team/teamPlanPageShotCovering';

const TeamCenterPlanCardFace = memo(function TeamCenterPlanCardFace() {
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
});

/** 团队中心套餐卡 · 稿面独立；勿 `morph`（DS 收起 = 整页壳层+内容缩回，非根页提前淡出）。 */
export function TeamCenterPlanCard() {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();

  const onTouchStart = useCallback((event: GestureResponderEvent) => {
    if (event.nativeEvent.touches.length === 1) {
      armTeamPlanPageShotCovering();
    }
  }, []);

  return (
    <View onTouchStart={onTouchStart} style={{ alignSelf: 'stretch' }}>
      <EgPageShotTrigger
        id={TEAM_PLAN_PAGE_SHOT_ID}
        radius={edsPx(spacing['radius-md'])}
        stretch
        accessibilityLabel={t('team.subscription')}
      >
        <TeamCenterPlanCardFace />
      </EgPageShotTrigger>
    </View>
  );
}