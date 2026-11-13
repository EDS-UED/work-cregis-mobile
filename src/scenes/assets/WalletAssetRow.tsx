import { View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { DataListRow } from '@/scenes/shared/DataListRow';
import { SceneText } from '@/scenes/shared/SceneText';
import type { AssetItem } from '@/store/useAssetsStore';
import { edsCryptoSymbolForCurrency } from '@/utils/edsCryptoSymbol';
import { edsPx } from '@/utils/edsTheme';

type WalletAssetRowProps = {
  item: AssetItem;
  balanceVisible: boolean;
  multichainLabel: string;
  onPress?: () => void;
};

export function WalletAssetRow({
  item,
  balanceVisible,
  multichainLabel,
  onPress,
}: WalletAssetRowProps) {
  const { mode, spacing, colors } = useEdsTheme();
  const mediaGap = edsPx(spacing['spacing-3']);
  const avatarSize = edsPx(spacing['avatar-lg']);
  const cryptoSymbol = edsCryptoSymbolForCurrency(item.symbol);

  return (
    <DataListRow
      axis="row"
      gap={mediaGap}
      onPress={onPress}
      accessibilityLabel={`${item.symbol} ${item.name}`}
    >
      <View
        style={{
          width: avatarSize,
          height: avatarSize,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {cryptoSymbol ? (
          <EgSymbol
            name={cryptoSymbol}
            mode={mode}
            displayPx={avatarSize}
            accessibilityLabel={item.symbol}
          />
        ) : (
          <View
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: edsPx(spacing['radius-full']),
              backgroundColor: String(colors['material-card-shallow']),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SceneText variant="bodySemibold">{item.symbol.slice(0, 1)}</SceneText>
          </View>
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: edsPx(spacing['spacing-05']) }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: edsPx(spacing['spacing-2']),
          }}
        >
          <SceneText variant="bodySemibold">{item.symbol}</SceneText>
          {item.multichain ? (
            <View
              style={{
                paddingHorizontal: edsPx(spacing['spacing-2']),
                paddingVertical: edsPx(spacing['spacing-05']),
                borderRadius: edsPx(spacing['radius-full']),
                backgroundColor: String(colors['material-card-shallow']),
              }}
            >
              <SceneText variant="footnotePrimary">{multichainLabel}</SceneText>
            </View>
          ) : null}
        </View>
        <SceneText variant="bodySmallSecondary" numberOfLines={1}>
          {item.name}
        </SceneText>
        <SceneText variant="bodySmallTertiary">
          {balanceVisible ? item.balance : '****'}
        </SceneText>
      </View>
    </DataListRow>
  );
}
