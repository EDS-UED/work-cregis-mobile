import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgDataListRowPressable } from '@/eds/data-list';
import { EgSymbol } from '@/eds/home-ui';
import { EgOptionButton } from '@/eds/scene-buttons';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import {
  teamSubscriptionSupportBannerMarginH,
  teamSubscriptionSupportBannerMarginTop,
  teamSubscriptionSupportBannerPaddingH,
  teamSubscriptionSupportBannerRadius,
  teamSubscriptionSupportBannerTitleBodyGap,
  teamSubscriptionSupportBannerTitleIconGap,
  teamSubscriptionSupportBannerTitleIconSize,
} from '@/scenes/team/teamSubscriptionItemLayout';
import { edsPx } from '@/utils/edsTheme';

const SUPPORT_TITLE_ICON = 'eds-user-mobiletabbar-fill';

type TeamSubscriptionSupportBannerProps = {
  onPressContact?: () => void;
};

/** 订阅稿 · 专属客户经理条 · 整卡点按 · 右侧 `EgOptionButton` 描边态。 */
export function TeamSubscriptionSupportBanner({ onPressContact }: TeamSubscriptionSupportBannerProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const marginH = teamSubscriptionSupportBannerMarginH(spacing);
  const cardPadH = teamSubscriptionSupportBannerPaddingH(spacing);
  const cardRadius = teamSubscriptionSupportBannerRadius(spacing);
  const titleIconPx = teamSubscriptionSupportBannerTitleIconSize(spacing);
  const titleIconGap = teamSubscriptionSupportBannerTitleIconGap(spacing);
  const titleBodyGap = teamSubscriptionSupportBannerTitleBodyGap(spacing);
  const contactLabel = t('team.subscriptionContact');

  const handleContact = useCallback(() => {
    onPressContact?.();
  }, [onPressContact]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          marginTop: teamSubscriptionSupportBannerMarginTop(spacing),
          marginHorizontal: marginH,
        },
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'stretch',
          gap: edsPx(spacing['spacing-3']),
          backgroundColor: String(colors['material-card-moderate']),
          borderRadius: cardRadius,
          borderCurve: 'continuous',
          paddingVertical: edsPx(spacing['spacing-4']),
          paddingHorizontal: cardPadH,
          overflow: 'hidden',
        },
        cardPressed: {
          backgroundColor: String(colors['event-tap']),
        },
        copy: {
          flex: 1,
          minWidth: 0,
          gap: titleBodyGap,
          justifyContent: 'center',
        },
        titleRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: titleIconGap,
        },
        action: {
          alignSelf: 'center',
        },
      }),
    [cardPadH, cardRadius, colors, marginH, spacing, titleBodyGap, titleIconGap],
  );

  return (
    <View style={styles.root}>
      <EgDataListRowPressable
        testID="subscription-support-banner"
        accessibilityLabel={contactLabel}
        onPress={handleContact}
        pressIntensity="sm"
        style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
      >
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <EgSymbol
              name={SUPPORT_TITLE_ICON}
              mode={mode}
              displayPx={titleIconPx}
              fillTone="primary"
              accessibilityLabel=""
            />
            <SceneText variant="bodySemibold" style={{ flex: 1, minWidth: 0 }}>
              {t('team.subscriptionSupportTitle')}
            </SceneText>
          </View>
          <SceneText variant="bodySmallSecondary">{t('team.subscriptionSupportSubtitle')}</SceneText>
        </View>
        <View style={styles.action} pointerEvents="none" importantForAccessibility="no-hide-descendants">
          <EgOptionButton
            label={contactLabel}
            mode={mode}
            size="sm"
            onPress={handleContact}
            accessibilityLabel={contactLabel}
          />
        </View>
      </EgDataListRowPressable>
    </View>
  );
}