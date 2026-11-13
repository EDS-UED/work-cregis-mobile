import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EgButtonGlass } from '@/eds/button-glass';
import { EgSymbol } from '@/eds/home-ui';
import {
  EG_NAV_BAR_PADDING_BOTTOM,
  EG_NAV_BAR_PADDING_HORIZONTAL,
  EG_NAV_BAR_PADDING_TOP,
  egNavBarScrollContentReserve,
} from '@/eds/nav-bar';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useScanAlbumPicker } from '@/scenes/scan/useScanAlbumPicker';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

/** 相机画面恒为深色，按钮与文字固定走 dark 档，不跟随系统主题。 */
const SCAN_CHROME_MODE = 'dark' as const;

const glassIconDefaults = {
  kind: 'icon' as const,
  iconCount: 1 as const,
  size: 'md' as const,
  mode: SCAN_CHROME_MODE,
};

type ScanTopBarProps = {
  torchOn: boolean;
  onToggleTorch: () => void;
};

/** 扫码页浮层顶栏 · 透明底 + 玻璃圆钮 + 居中标题。 */
export function ScanTopBar({ torchOn, onToggleTorch }: ScanTopBarProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();

  const onPickAlbum = useScanAlbumPicker();

  return (
    <View
      style={[styles.shell, { height: egNavBarScrollContentReserve(insets.top) }]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.row,
          {
            top: insets.top,
            paddingTop: EG_NAV_BAR_PADDING_TOP,
            paddingBottom: EG_NAV_BAR_PADDING_BOTTOM,
            paddingHorizontal: EG_NAV_BAR_PADDING_HORIZONTAL,
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.titleSlot} pointerEvents="none">
          <SceneText
            variant="bodySemibold"
            numberOfLines={1}
            style={{ color: String(colors['text-same-white']) }}
          >
            {t('home.scan')}
          </SceneText>
        </View>
        <EgButtonGlass
          {...glassIconDefaults}
          icon="eds-arrow-left-ios"
          accessibilityLabel={t('common.back')}
          onPress={() => navigation.goBack()}
          testID="scan-nav-back"
        />
        <View style={[styles.trailing, { gap: edsPx(spacing['spacing-2-5']) }]}>
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
                  mode={SCAN_CHROME_MODE}
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
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSlot: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
