import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgDataListRowPressable } from '@/eds/data-list';
import { EgSymbol } from '@/eds/home-ui';
import { EgTag } from '@/eds/tag';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  walletSwitcherCardBalanceGapTop,
  walletSwitcherCardPaddingHorizontal,
  walletSwitcherCardPaddingVertical,
  WALLET_SWITCHER_CARD_SIG_ICON_STROKE_SCALE,
  walletSwitcherCardSigIconDisplayPx,
  walletSwitcherCardSubIconGap,
  walletSwitcherCardTitleIconNameGap,
  walletSwitcherCardTitleSubGap,
  walletSwitcherCardTitleTagGap,
} from '@/scenes/assets/walletSwitcherLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import type { WalletSwitcherItem } from '@/store/useAssetsStore';
import { edsPx } from '@/utils/edsTheme';

const WALLET_BALANCE_MASK = '**********';

type WalletSwitcherCardProps = {
  wallet: WalletSwitcherItem;
  selected: boolean;
  balanceVisible: boolean;
  onSelect: () => void;
};

export function WalletSwitcherCard({
  wallet,
  selected,
  balanceVisible,
  onSelect,
}: WalletSwitcherCardProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();

  const sigLabel =
    wallet.sigKind === 'multisig'
      ? t('scenes.walletSigMultisig')
      : t('scenes.walletSigSinglesig');

  const balanceDisplay = balanceVisible ? wallet.balanceDisplay : WALLET_BALANCE_MASK;

  const padH = walletSwitcherCardPaddingHorizontal(spacing);
  const padV = walletSwitcherCardPaddingVertical(spacing);
  const titleIconNameGap = walletSwitcherCardTitleIconNameGap(spacing);
  const titleTagGap = walletSwitcherCardTitleTagGap(spacing);
  const titleSubGap = walletSwitcherCardTitleSubGap(spacing);
  const subIconGap = walletSwitcherCardSubIconGap(spacing);
  const balanceGapTop = walletSwitcherCardBalanceGapTop(spacing);
  const sigIconPx = walletSwitcherCardSigIconDisplayPx(spacing);
  const checkGap = edsPx(spacing['spacing-3']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        outer: {
          alignSelf: 'stretch',
        },
        shell: {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: edsPx(spacing['radius-sm']),
          borderCurve: 'continuous',
          paddingHorizontal: padH,
          paddingVertical: padV,
          borderWidth: edsPx(spacing['stroke-sm']),
        },
        body: {
          flex: 1,
          minWidth: 0,
        },
        textStack: {
          gap: titleSubGap,
        },
        titleRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
        },
        titleName: {
          flexShrink: 1,
          minWidth: 0,
          marginRight: titleTagGap,
        },
        titleLeadIcon: {
          marginRight: titleIconNameGap,
        },
        checkSlot: {
          flexShrink: 0,
          marginLeft: checkGap,
          justifyContent: 'center',
        },
        shardRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: subIconGap,
        },
        balance: {
          marginTop: balanceGapTop,
        },
      }),
    [
      balanceGapTop,
      checkGap,
      padH,
      padV,
      spacing,
      subIconGap,
      titleIconNameGap,
      titleSubGap,
      titleTagGap,
    ],
  );

  const resolveShellColors = (pressed: boolean) => ({
    backgroundColor: String(pressed ? colors['event-tap'] : colors['material-hide']),
    borderColor: String(pressed ? colors['stroke-hide'] : colors['stroke-divider-shallow']),
  });

  return (
    <EgDataListRowPressable
      accessibilityLabel={`${wallet.name} ${sigLabel} ${balanceDisplay}`}
      onPress={onSelect}
      style={styles.outer}
    >
      {({ pressed }) => (
        <View style={[styles.shell, resolveShellColors(pressed)]}>
          <View style={styles.body}>
            <View style={styles.textStack}>
              <View style={styles.titleRow}>
                <View style={styles.titleLeadIcon}>
                  <EgSymbol
                    name="eds-wallet"
                    mode={mode}
                    displayPx={sigIconPx}
                    strokeScaleToken={WALLET_SWITCHER_CARD_SIG_ICON_STROKE_SCALE}
                    strokeColorToken="text-base-primary"
                    accessibilityLabel=""
                  />
                </View>
                <SceneText variant="bodySmallMedium" numberOfLines={2} style={styles.titleName}>
                  {wallet.name}
                </SceneText>
                <EgTag
                  family="system"
                  variant="subtle"
                  size="sm"
                  rowAlign
                  mode={mode}
                  label={sigLabel}
                  accessibilityLabel={sigLabel}
                />
              </View>
              <View style={styles.shardRow}>
                <SceneText
                  variant="bodySmallSecondary"
                  style={{
                    color: String(
                      wallet.shardSynced ? colors['material-decor'] : colors['text-base-tertiary'],
                    ),
                  }}
                >
                  {t('scenes.walletSwitcherShard')}
                </SceneText>
                <EgSymbol
                  name={wallet.shardSynced ? 'eds-enable-fill' : 'eds-close-circle-fill'}
                  mode={mode}
                  size="xs"
                  displayPx={edsPx(spacing['symbol-xs'])}
                  strokeColorToken={
                    wallet.shardSynced ? 'status-success' : 'status-disable-base'
                  }
                  fillTone="primary"
                  accessibilityLabel=""
                />
              </View>
            </View>
            <SceneText variant="bodyLargeStrong" style={styles.balance}>
              {balanceDisplay}
            </SceneText>
          </View>
          {selected ? (
            <View style={styles.checkSlot}>
              <EgSymbol
                name="eds-enable-fill"
                mode={mode}
                displayPx={edsPx(spacing['symbol-md'])}
                strokeColorToken="material-decor"
                accessibilityLabel=""
              />
            </View>
          ) : null}
        </View>
      )}
    </EgDataListRowPressable>
  );
}