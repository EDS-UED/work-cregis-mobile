import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  EgPageShotContent,
  EG_PAGE_CONTENT_PADDING_BOTTOM,
  EG_PAGE_CONTENT_PADDING_HORIZONTAL,
  type EgPageShotRootApi,
} from '@/eds/page-shot';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';
import { TeamCenterPlanCardSourceFace } from '@/scenes/team/TeamCenterPlanCard';
import {
  armTeamPlanPageShotCovering,
  releaseTeamPlanPageShotCovering,
} from '@/scenes/team/teamPlanPageShotCovering';
import { TeamPlanPageShotHero } from '@/scenes/team/TeamPlanPageShotHero';
import { TeamSubscriptionPageShotContent } from '@/scenes/team/TeamSubscriptionPageShotContent';
import { teamSubscriptionHeroToBenefitsGap } from '@/scenes/team/teamSubscriptionItemLayout';

type TeamPlanPageShotRootProps = {
  api: EgPageShotRootApi;
};

/**
 * 订阅根页 · 展开后的 Hero / 正文布局不变。
 * 近卡片的一段用 DS `sourceFaceStyle` / `pageFaceStyle`（`motion-ratio-page-shot-morph`）
 * 在列表套餐卡与订阅 Hero 之间交叉，不改订阅稿面本身。
 */
export function TeamPlanPageShotRoot({ api }: TeamPlanPageShotRootProps) {
  const { mode, spacing } = useEdsTheme();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { width: pageWidth } = useWindowDimensions();
  const pageBg = String(colors['box-page']);

  useEffect(() => {
    armTeamPlanPageShotCovering();
    return releaseTeamPlanPageShotCovering;
  }, []);
  const scrollBottomInset = EG_PAGE_CONTENT_PADDING_BOTTOM + insets.bottom;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        /** Page-Shot 滚动区须常开 `flexGrow`，`EgPageShotScroll` 才能判定可滚并开底弹。 */
        scrollContent: {
          flexGrow: 1,
          backgroundColor: pageBg,
        },
        body: {
          paddingHorizontal: EG_PAGE_CONTENT_PADDING_HORIZONTAL,
          paddingTop: teamSubscriptionHeroToBenefitsGap(spacing),
          gap: edsPx(spacing['spacing-0']),
          backgroundColor: pageBg,
        },
      }),
    [pageBg, spacing],
  );

  return (
    <View style={{ flex: 1 }}>
      <EgPageShotContent
        mode={mode}
        api={api}
        contentPaddingHorizontal={0}
        contentPaddingTop={0}
        contentPaddingBottom={scrollBottomInset}
        contentContainerStyle={styles.scrollContent}
        style={{ flex: 1, backgroundColor: pageBg }}
      >
        <Animated.View style={[{ alignSelf: 'stretch' }, api.pageFaceStyle] as StyleProp<ViewStyle>}>
          <TeamPlanPageShotHero />
        </Animated.View>
        <Animated.View style={[styles.body, api.bodyStyle] as StyleProp<ViewStyle>}>
          <TeamSubscriptionPageShotContent />
        </Animated.View>
      </EgPageShotContent>
      <Animated.View
        pointerEvents="none"
        style={
          [
            { position: 'absolute', top: 0, left: 0, right: 0 },
            api.sourceFaceStyle,
          ] as StyleProp<ViewStyle>
        }
      >
        <TeamCenterPlanCardSourceFace
          cardWidth={api.source.rect.width}
          cardHeight={api.source.rect.height}
          pageWidth={pageWidth}
        />
      </Animated.View>
    </View>
  );
}