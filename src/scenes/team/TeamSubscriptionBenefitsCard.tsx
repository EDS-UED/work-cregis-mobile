import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgDataList } from '@/eds/data-list';
import { EgLink } from '@/eds/link-button';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamSubscriptionDisclosureRow } from '@/scenes/team/TeamSubscriptionDisclosureRow';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type QuotaMeterProps = {
  label: string;
  used: number;
  max: number;
  onExpand?: () => void;
};

function QuotaMeter({ label, used, max, onExpand }: QuotaMeterProps) {
  const { t } = useTranslation();
  const { mode, colors, spacing } = useEdsTheme();
  const ratio = max > 0 ? Math.min(1, Math.max(0, used / max)) : 0;
  const barHeight = edsPx(spacing['spacing-2']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        block: {
          gap: edsPx(spacing['spacing-2']),
        },
        head: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: edsPx(spacing['spacing-3']),
        },
        label: {
          flex: 1,
          minWidth: 0,
        },
        trail: {
          flexDirection: 'row',
          alignItems: 'center',
          flexShrink: 0,
          gap: edsPx(spacing['spacing-2']),
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
          backgroundColor: String(colors['material-brand']),
        },
      }),
    [barHeight, colors, ratio, spacing],
  );

  return (
    <View
      style={styles.block}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max, now: used }}
    >
      <View style={styles.head}>
        <SceneText variant="bodyMediumStrong" style={styles.label} numberOfLines={1}>
          {label}
        </SceneText>
        <View style={styles.trail}>
          <SceneText variant="bodySmallSecondary">
            {used} / {max}
          </SceneText>
          <EgLink
            mode={mode}
            size="sm"
            tone="brand"
            label={t('team.subscriptionExpandQuota')}
            onPress={onExpand}
            accessibilityLabel={t('team.subscriptionExpandQuota')}
          />
        </View>
      </View>
      <View style={styles.track}>
        <View style={styles.fill} />
      </View>
    </View>
  );
}

type TeamSubscriptionBenefitsCardProps = {
  singleSigUsed: number;
  singleSigMax: number;
  multiSigUsed: number;
  multiSigMax: number;
  addressCount: number;
  onExpandSingleSig?: () => void;
  onExpandMultiSig?: () => void;
  onPressAddresses?: () => void;
};

/** 订阅权益 · 用量条 + 地址入口（列表行 `EgDataList`）。 */
export function TeamSubscriptionBenefitsCard({
  singleSigUsed,
  singleSigMax,
  multiSigUsed,
  multiSigMax,
  addressCount,
  onExpandSingleSig,
  onExpandMultiSig,
  onPressAddresses,
}: TeamSubscriptionBenefitsCardProps) {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();

  const bodyStyles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          alignSelf: 'stretch',
          gap: edsPx(spacing['spacing-3']),
        },
        head: {
          gap: edsPx(spacing['spacing-1']),
        },
        meters: {
          gap: edsPx(spacing['spacing-5']),
        },
        copy: {
          gap: edsPx(spacing['spacing-5']),
        },
      }),
    [spacing],
  );

  return (
    <View style={bodyStyles.root} testID="subscription-benefits">
      <View style={bodyStyles.copy}>
        <View style={bodyStyles.head}>
          <SceneText variant="title">{t('team.benefits')}</SceneText>
          <SceneText variant="bodySmallSecondary">
            {t('team.subscriptionEnterpriseMultisig')}
          </SceneText>
        </View>
        <View style={bodyStyles.meters}>
          <QuotaMeter
            label={t('team.subscriptionSingleSigQuota')}
            used={singleSigUsed}
            max={singleSigMax}
            onExpand={onExpandSingleSig}
          />
          <QuotaMeter
            label={t('team.subscriptionMultiSigQuota')}
            used={multiSigUsed}
            max={multiSigMax}
            onExpand={onExpandMultiSig}
          />
        </View>
      </View>
      <EgDataList sceneContentInset={0} rowGap={edsPx(spacing['spacing-0'])}>
        <TeamSubscriptionDisclosureRow
          testID="subscription-wallet-addresses"
          label={t('team.subscriptionWalletAddresses')}
          value={t('team.subscriptionWalletAddressCount', { count: addressCount })}
          onPress={onPressAddresses}
          accessibilityLabel={t('team.subscriptionWalletAddresses')}
          isLast
        />
      </EgDataList>
    </View>
  );
}