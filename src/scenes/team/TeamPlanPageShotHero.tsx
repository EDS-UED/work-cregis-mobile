import { useCallback, useMemo, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamCenterPlanCardContent } from '@/scenes/team/TeamCenterPlanCardContent';
import { getTeamPlanCardLastLayoutSize } from '@/scenes/team/teamPlanCardLayout';
import { edsPx } from '@/utils/edsTheme';

type TeamPlanPageShotHeroProps = {
  pageWidth: number;
  /** Nav 占位 · 仅作 Hero 内 `paddingTop`，勿再负 `marginTop`（page-shot 下拉时顶会露缝）。 */
  topInset?: number;
};

/** 订阅 page-shot 顶区 · 与列表同滚；顶缘从 scroll 内容 0 起绘渐变。 */
export function TeamPlanPageShotHero({ pageWidth, topInset = 0 }: TeamPlanPageShotHeroProps) {
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();
  const paddingHorizontal = edsPx(spacing['spacing-6']);
  const lastCard = getTeamPlanCardLastLayoutSize();

  const initialSize = useMemo(() => {
    const width =
      lastCard.width > 0 ? lastCard.width : Math.max(0, pageWidth - paddingHorizontal * 2);
    const height = lastCard.height > 0 ? lastCard.height : edsPx(spacing['spacing-28']);
    return { width, height };
  }, [lastCard.height, lastCard.width, paddingHorizontal, pageWidth, spacing]);

  const [layoutSize, setLayoutSize] = useState(initialSize);
  const paddingTop = topInset;

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayoutSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  return (
    <View
      onLayout={onLayout}
      style={{
        width: pageWidth,
        paddingTop,
        paddingHorizontal,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: String(colors['material-card-moderate']),
      }}
    >
      <TeamCenterPlanCardContent
        width={layoutSize.width}
        height={layoutSize.height}
        showAccountLink={false}
      />
    </View>
  );
}