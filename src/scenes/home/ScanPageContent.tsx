import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { GlassBlurBackdrop } from '@/eds/glass';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { ScanFullScreenCamera } from '@/scenes/home/ScanFullScreenCamera';
import {
  SCAN_VIEWFINDER_CORNER_RADIUS,
  SCAN_VIEWFINDER_STROKE,
  ScanQrViewfinderOverlay,
} from '@/scenes/home/ScanQrViewfinderOverlay';
import { ScanQrFrostedMask } from '@/scenes/scan/ScanQrFrostedMask';
import { buildScanNativeHeaderRightItems } from '@/scenes/scan/scanNativeIosHeader';
import { ScanTopBar } from '@/scenes/scan/ScanTopBar';
import { useScanAlbumPicker } from '@/scenes/scan/useScanAlbumPicker';
import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  SCAN_LAYER_CAMERA,
  SCAN_LAYER_CHROME,
  SCAN_LAYER_TOP_BAR,
  scanLayerSurface,
} from '@/scenes/scan/scanLayers';
import { useScanTorchAssistant } from '@/scenes/scan/useScanTorchAssistant';

const VIEWFINDER_WIDTH_RATIO = 0.72;
/** 取景框相对屏幕垂直居中再上移。 */
const VIEWFINDER_RAISE = 60;

type ScanPageContentProps = {
  contentStyle?: ViewStyle;
  /** page-shot 自带 EDS 顶栏（标题 + 关闭）时传 `false`，避免双栏。 */
  showTopBar?: boolean;
};

/** 扫码页 · 全屏相机 + 取景磨砂暗角 + 浮层顶栏。 */
export function ScanPageContent({ contentStyle, showTopBar = true }: ScanPageContentProps) {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();
  const navigation = useNavigation();
  const colors = useThemeColors();
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const showOverlayTopBar = showTopBar && !nativeNavBar;
  const onPickAlbum = useScanAlbumPicker();
  const [permission, requestPermission] = useCameraPermissions();
  const permissionGranted = permission?.granted === true;
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    if (!permission || permission.granted || permission.canAskAgain === false) {
      return;
    }
    void requestPermission();
  }, [permission, requestPermission]);

  const viewfinderSize = Math.round(windowWidth * VIEWFINDER_WIDTH_RATIO);
  const frameLeft = (windowWidth - viewfinderSize) / 2;
  const frameTop = Math.round((windowHeight - viewfinderSize) / 2) - VIEWFINDER_RAISE;

  const { torchOn, toggleTorch } = useScanTorchAssistant({ cameraReady, permissionGranted });

  const applyNativeHeader = useCallback(() => {
    if (!nativeNavBar) {
      return;
    }
    navigation.setOptions({
      unstable_headerRightItems: () =>
        buildScanNativeHeaderRightItems({
          spacing,
          torchOn,
          onToggleTorch: toggleTorch,
          onPickAlbum,
          t,
        }),
    });
  }, [nativeNavBar, navigation, onPickAlbum, spacing, t, torchOn, toggleTorch]);

  useLayoutEffect(() => {
    applyNativeHeader();
  }, [applyNativeHeader]);

  useFocusEffect(
    useCallback(() => {
      applyNativeHeader();
    }, [applyNativeHeader]),
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        page: {
          flex: 1,
          minHeight: windowHeight,
          overflow: 'visible',
          backgroundColor: String(colors['material-same-black']),
        },
        cameraHost: {
          ...StyleSheet.absoluteFill,
          ...scanLayerSurface(SCAN_LAYER_CAMERA),
        },
        chromeHost: {
          ...StyleSheet.absoluteFill,
          ...scanLayerSurface(SCAN_LAYER_CHROME),
        },
        topBarHost: {
          ...StyleSheet.absoluteFill,
          ...scanLayerSurface(SCAN_LAYER_TOP_BAR),
        },
        frameHost: {
          position: 'absolute',
          left: frameLeft,
          top: frameTop,
          width: viewfinderSize,
          height: viewfinderSize,
        },
      }),
    [colors, frameLeft, frameTop, viewfinderSize, windowHeight],
  );

  const frame = useMemo(
    () => ({ left: frameLeft, top: frameTop, width: viewfinderSize, height: viewfinderSize }),
    [frameLeft, frameTop, viewfinderSize],
  );

  return (
    <View style={[styles.page, contentStyle]} collapsable={false}>
      <View style={styles.cameraHost} collapsable={false} pointerEvents="box-none">
        <GlassBlurBackdrop style={StyleSheet.absoluteFill} active>
          <ScanFullScreenCamera
            permission={permission}
            requestPermission={requestPermission}
            torchEnabled={torchOn}
            onCameraReady={() => setCameraReady(true)}
          />
        </GlassBlurBackdrop>
      </View>

      {permissionGranted ? (
        <View style={styles.chromeHost} collapsable={false} pointerEvents="box-none">
          <ScanQrFrostedMask
            windowWidth={windowWidth}
            windowHeight={windowHeight}
            frame={frame}
            stroke={SCAN_VIEWFINDER_STROKE}
            cornerRadius={SCAN_VIEWFINDER_CORNER_RADIUS}
          />
          <View style={styles.frameHost} pointerEvents="none">
            <ScanQrViewfinderOverlay size={viewfinderSize} />
          </View>
        </View>
      ) : null}

      {showOverlayTopBar ? (
        <View style={styles.topBarHost} collapsable={false} pointerEvents="box-none">
          <ScanTopBar torchOn={torchOn} onToggleTorch={toggleTorch} />
        </View>
      ) : null}
    </View>
  );
}