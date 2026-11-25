import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgDataListRowPressable } from '@/eds/data-list';
import { EG_ITEM_GROUP_RADIUS, EG_ITEM_PAD_H, EgItem, EgItemGroup } from '@/eds/item';
import { EgLink } from '@/eds/link-button';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamSubscriptionDisclosureRow } from '@/scenes/team/TeamSubscriptionDisclosureRow';
import {
  teamSubscriptionBenefitItemPaddingV,
  teamSubscriptionBenefitProgressGapTop,
  teamSubscriptionEgItemGroupScreenStyle,
} from '@/scenes/team/teamSubscriptionItemLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type TeamSubscriptionBenefitItemProgressProps = {
  used: number;
  max: number;
  accessibilityLabel: string;
};

/** 权益行内进度（业务自定义 · 不扩 DS `EgItem`）。 */
function TeamSubscriptionBenefitItemProgress({
  used,
  max,
  accessibilityLabel,
}: TeamSubscriptionBenefitItemProgressProps) {
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();
  const ratio = max > 0 ? Math.min(1, Math.max(0, used / max)) : 0;
  const barHeight = edsPx(spacing['spacing-2']);
  const padH = EG_ITEM_PAD_H as number;
  const brandFill = String(colors.brand);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        shell: {
          alignSelf: 'stretch',
          paddingHorizontal: padH,
        },
        track: {
          alignSelf: 'stretch',
          width: '100%',
          flexDirection: 'row',
          height: barHeight,
          borderRadius: edsPx(spacing['radius-full']),
          backgroundColor: String(colors['material-card-deep']),
          overflow: 'hidden',
        },
        fill: {
          width: `${ratio * 100}%`,
          height: barHeight,
          backgroundColor: brandFill,
        },
      }),
    [barHeight, brandFill, colors, padH, ratio, spacing],
  );

  return (
    <View
      style={styles.shell}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max, now: used }}
    >
      <View style={styles.track}>
        <View style={styles.fill} />
      </View>
    </View>
  );
}

type TeamSubscriptionQuotaRowProps = {
  testID: string;
  label: string;
  used: number;
  max: number;
  onExpand?: () => void;
};

/**
 * 单签 / 多签 · 组缘距屏 4px · 行内左右 16 / 上下 12（`EgItem` md）· 点按与进度条同一组。
 */
function TeamSubscriptionQuotaRow({
  testID,
  label,
  used,
  max,
  onExpand,
}: TeamSubscriptionQuotaRowProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const rowPadV = teamSubscriptionBenefitItemPaddingV(spacing);
  const progressGap = teamSubscriptionBenefitProgressGapTop(spacing);
  const tapRadius = EG_ITEM_GROUP_RADIUS as number;

  const quotaNote = `${used} / ${max}`;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        itemShell: {
          alignSelf: 'stretch',
        },
        pressBlock: {
          alignSelf: 'stretch',
          gap: progressGap,
          paddingBottom: rowPadV,
          borderRadius: tapRadius,
          borderCurve: 'continuous',
          overflow: 'hidden',
        },
        quotaItemRow: {
          paddingTop: rowPadV,
          paddingBottom: 0,
        },
        trail: {
          flexDirection: 'row',
          alignItems: 'center',
          flexShrink: 0,
          gap: edsPx(spacing['spacing-2']),
        },
      }),
    [progressGap, rowPadV, spacing, tapRadius],
  );

  return (
    <View style={styles.itemShell}>
      <EgDataListRowPressable
        testID={testID}
        onPress={onExpand}
        pressIntensity="xs"
        accessibilityLabel={`${label}, ${quotaNote}`}
        style={({ pressed }) => [
          styles.pressBlock,
          pressed ? { backgroundColor: String(colors['event-tap']) } : null,
        ]}
      >
        <EgItem
          mode={mode}
          label={label}
          labelHeavy
          padSize="md"
          style={styles.quotaItemRow}
          value={quotaNote}
          showDivider={false}
          trailingEnabled
          trailingDisplay="custom"
          showChevron={false}
          trailing={
            <View style={styles.trail}>
              <SceneText variant="bodySmallSecondary" numberOfLines={1}>
                {quotaNote}
              </SceneText>
              <EgLink
                mode={mode}
                size="md"
                tone="brand"
                label={t('team.subscriptionExpandQuota')}
                onPress={onExpand}
                accessibilityLabel={t('team.subscriptionExpandQuota')}
              />
            </View>
          }
          accessibilityLabel={`${label}, ${quotaNote}`}
        />
        <TeamSubscriptionBenefitItemProgress
          used={used}
          max={max}
          accessibilityLabel={label}
        />
      </EgDataListRowPressable>
    </View>
  );
}

type TeamSubscriptionBenefitsCardProps = {
  singleSigUsed: number;
  singleSigMax: number;
  multiSigUsed: number;
  multiSigMax: number;
  addressCount: number;
  /** 外层 `TeamSubscriptionSection` 已提供标题时传 `false`。 */
  showSectionTitle?: boolean;
  onExpandSingleSig?: () => void;
  onExpandMultiSig?: () => void;
  onPressAddresses?: () => void;
};

/** 订阅权益 · 用量 `EgItem` + 地址入口 · `EgItemGroup` `gap: spacing-1`。 */
export function TeamSubscriptionBenefitsCard({
  singleSigUsed,
  singleSigMax,
  multiSigUsed,
  multiSigMax,
  addressCount,
  showSectionTitle = true,
  onExpandSingleSig,
  onExpandMultiSig,
  onPressAddresses,
}: TeamSubscriptionBenefitsCardProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();

  const bodyStyles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          alignSelf: 'stretch',
          gap: edsPx(spacing['spacing-3']),
        },
        head: {
          gap: edsPx(spacing['spacing-0']),
        },
      }),
    [spacing],
  );

  const benefitsGroupStyle = useMemo(
    () => teamSubscriptionEgItemGroupScreenStyle(spacing),
    [spacing],
  );

  return (
    <View style={bodyStyles.root} testID="subscription-benefits">
      {showSectionTitle ? (
        <View style={bodyStyles.head}>
          <SceneText variant="title">{t('team.benefits')}</SceneText>
        </View>
      ) : null}
      <EgItemGroup mode={mode} style={benefitsGroupStyle} testID="subscription-benefits-quota">
        <TeamSubscriptionQuotaRow
          testID="subscription-single-sig-quota"
          label={t('team.subscriptionSingleSigQuota')}
          used={singleSigUsed}
          max={singleSigMax}
          onExpand={onExpandSingleSig}
        />
        <TeamSubscriptionQuotaRow
          testID="subscription-multi-sig-quota"
          label={t('team.subscriptionMultiSigQuota')}
          used={multiSigUsed}
          max={multiSigMax}
          onExpand={onExpandMultiSig}
        />
        <TeamSubscriptionDisclosureRow
          testID="subscription-wallet-addresses"
          label={t('team.subscriptionWalletAddresses')}
          value={t('team.subscriptionWalletAddressCount', { count: addressCount })}
          onPress={onPressAddresses}
          accessibilityLabel={t('team.subscriptionWalletAddresses')}
        />
      </EgItemGroup>
    </View>
  );
}