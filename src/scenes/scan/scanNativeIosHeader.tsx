import { View } from 'react-native';
import type { NativeStackHeaderItem } from '@react-navigation/native-stack';
import type { TFunction } from 'i18next';

import { EgButtonGlass } from '@/eds/button-glass';
import { EgSymbol } from '@/eds/home-ui';
import { egNavBarNativeStackHeaderGlassItem } from '@/eds/nav-bar';
import { edsPx } from '@/utils/edsTheme';
import type mobileTheme from '@/eds/tokens';

/** 扫码页 iOS 26+ 系统栏 · 固定 dark（相机全屏深色，不跟系统外观）。 */
export const SCAN_NATIVE_NAV_MODE = 'dark' as const;

const glassIconDefaults = {
  kind: 'icon' as const,
  iconCount: 1 as const,
  size: 'md' as const,
  mode: SCAN_NATIVE_NAV_MODE,
};

type BuildScanNativeHeaderRightItemsInput = {
  spacing: typeof mobileTheme.spacing;
  torchOn: boolean;
  onToggleTorch: () => void;
  onPickAlbum: () => void;
  t: TFunction;
};

export function buildScanNativeHeaderRightItems({
  spacing,
  torchOn,
  onToggleTorch,
  onPickAlbum,
  t,
}: BuildScanNativeHeaderRightItemsInput): NativeStackHeaderItem[] {
  const itemGap = edsPx(spacing['spacing-2-5']);
  const row = { flexDirection: 'row' as const, alignItems: 'center' as const, gap: itemGap };

  return [
    egNavBarNativeStackHeaderGlassItem(
      <View style={row}>
        <EgButtonGlass
          {...glassIconDefaults}
          icon="eds-photo"
          accessibilityLabel={t('home.scanAlbum')}
          onPress={onPickAlbum}
          testID="scan-nav-album"
        />
        {torchOn ? (
          <EgButtonGlass
            {...glassIconDefaults}
            iconSlot={
              <EgSymbol
                name="eds-bulb-fill"
                size="md"
                mode={SCAN_NATIVE_NAV_MODE}
                fillTone="brand"
              />
            }
            accessibilityLabel={t('home.scanTorch')}
            onPress={onToggleTorch}
            testID="scan-nav-torch"
          />
        ) : (
          <EgButtonGlass
            {...glassIconDefaults}
            icon="eds-bulb"
            accessibilityLabel={t('home.scanTorch')}
            onPress={onToggleTorch}
            testID="scan-nav-torch"
          />
        )}
      </View>,
    ),
  ];
}