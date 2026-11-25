import { useMemo } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
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
import { TeamPlanPageShotHero } from '@/scenes/team/TeamPlanPageShotHero';
import { TeamSubscriptionPageShotContent } from '@/scenes/team/TeamSubscriptionPageShotContent';

type TeamPlanPageShotRootProps = {
  api: EgPageShotRootApi;
};

/**
 * 订阅根页 · `EgPageShotContent`（DS `CardShotRoot` 形）· 勿改顶区/正文稿面，动效见触发器 `morph` 与宿主。
 */
export function TeamPlanPageShotRoot({ api }: TeamPlanPageShotRootProps) {
  const { mode, spacing } = useEdsTheme();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const pageBg = String(colors['box-page']);
  const scrollBottomInset = EG_PAGE_CONTENT_PADDING_BOTTOM + insets.bottom;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        body: {
          paddingHorizontal: EG_PAGE_CONTENT_PADDING_HORIZONTAL,
          gap: edsPx(spacing['spacing-3']),
          backgroundColor: pageBg,
        },
      }),
    [pageBg, spacing],
  );

  return (
    <EgPageShotContent
      mode={mode}
      api={api}
      contentPaddingHorizontal={0}
      contentPaddingTop={0}
      contentPaddingBottom={scrollBottomInset}
      style={{ flex: 1, backgroundColor: pageBg }}
    >
      <TeamPlanPageShotHero />
      <Animated.View style={[styles.body, api.bodyStyle] as StyleProp<ViewStyle>}>
        <TeamSubscriptionPageShotContent />
      </Animated.View>
    </EgPageShotContent>
  );
}