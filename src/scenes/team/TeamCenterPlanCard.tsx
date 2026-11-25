import { memo, useCallback, useEffect, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TeamPlanEgPageShotTrigger } from '@/scenes/team/teamPlanEgPageShot';
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
import { releaseTeamPlanPageShotCovering } from '@/scenes/team/teamPlanPageShotCovering';

const TeamCenterPlanCardFace = memo(function TeamCenterPlanCardFace({
  width,
  height,
  reportLayout = true,
}: {
  width?: number;
  height?: number;
  reportLayout?: boolean;
}) {
  const shellStyles = useTeamCenterPlanCardShellStyle();
  const [cardSize, setCardSize] = useState(getTeamPlanCardLastLayoutSize);
  const locked = width != null && height != null && width > 0 && height > 0;
  const resolvedWidth = locked ? width : cardSize.width;
  const resolvedHeight = locked ? height : cardSize.height;

  const onCardLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!reportLayout) return;
      const next = {
        width: event.nativeEvent.layout.width,
        height: event.nativeEvent.layout.height,
      };
      setTeamPlanCardLastLayoutSize(next);
      setCardSize((prev) =>
        prev.width === next.width && prev.height === next.height ? prev : next,
      );
    },
    [reportLayout],
  );

  return (
    <View
      style={[shellStyles.card, locked ? { width, height } : null]}
      onLayout={onCardLayout}
    >
      <TeamCenterPlanCardContent width={resolvedWidth} height={resolvedHeight} />
    </View>
  );
});

/**
 * 飞行稿 · 与列表卡同一壳（`spacing-6`、版本 / 到期 / 查看团队账户）。
 * 按页宽的逆缩放排进 page-shot 内容树，progress 0 时净缩放为 1，和触发卡重合。
 */
export function TeamCenterPlanCardSourceFace({
  cardWidth,
  cardHeight,
  pageWidth,
}: {
  cardWidth: number;
  cardHeight: number;
  pageWidth: number;
}) {
  if (cardWidth <= 0 || cardHeight <= 0 || pageWidth <= 0) return null;
  const counter = pageWidth / cardWidth;
  const boxHeight = cardHeight * counter;

  return (
    <View pointerEvents="none" style={{ width: pageWidth, height: boxHeight, overflow: 'hidden' }}>
      <View
        pointerEvents="none"
        style={{
          width: cardWidth,
          height: cardHeight,
          transform: [
            { translateX: (-cardWidth * (1 - counter)) / 2 },
            { translateY: (-cardHeight * (1 - counter)) / 2 },
            { scale: counter },
          ],
        }}
      >
        <TeamCenterPlanCardFace width={cardWidth} height={cardHeight} reportLayout={false} />
      </View>
    </View>
  );
}

/** 团队中心套餐卡 · 列表稿面独立于订阅 Hero；展开仍是 `stretch` page-shot。 */
export function TeamCenterPlanCard() {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();

  useEffect(() => releaseTeamPlanPageShotCovering(), []);

  return (
    <View style={{ alignSelf: 'stretch' }}>
      <TeamPlanEgPageShotTrigger
        id={TEAM_PLAN_PAGE_SHOT_ID}
        radius={edsPx(spacing['radius-md'])}
        stretch
        accessibilityLabel={t('team.subscription')}
      >
        <TeamCenterPlanCardFace />
      </TeamPlanEgPageShotTrigger>
    </View>
  );
}
