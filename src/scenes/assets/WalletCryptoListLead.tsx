import { View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { egDataListGraphicSlotPx } from '@/scenes/shared/egDataListGraphicMetrics';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsCryptoSymbolForCurrency } from '@/utils/edsCryptoSymbol';
import { edsPx } from '@/utils/edsTheme';

const WALLET_CRYPTO_GRAPHIC_SIZE = 'md' as const;

/** 钱包币种行 · EgDataList 图形 `md`（`avatar-xl` · 40px）· Showcase `graphicType: crypto`。 */
export function WalletCryptoListLead({ currency }: { currency: string }) {
  const { mode, spacing, colors } = useEdsTheme();
  const slot = egDataListGraphicSlotPx(spacing, WALLET_CRYPTO_GRAPHIC_SIZE);
  const cryptoSymbol = edsCryptoSymbolForCurrency(currency);

  return (
    <View
      style={{
        width: slot,
        height: slot,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {cryptoSymbol ? (
        <EgSymbol
          name={cryptoSymbol}
          mode={mode}
          displayPx={slot}
          accessibilityLabel={currency}
        />
      ) : (
        <View
          style={{
            width: slot,
            height: slot,
            borderRadius: edsPx(spacing['radius-full']),
            backgroundColor: String(colors['material-card-shallow']),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SceneText variant="bodySemibold">{currency.slice(0, 1)}</SceneText>
        </View>
      )}
    </View>
  );
}