import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

import { GlassBlurBackdrop } from '@/eds/glass';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { ScanFullScreenCamera } from '@/scenes/home/ScanFullScreenCamera';
import {
  SCAN_VIEWFINDER_CORNER_RADIUS,
  SCAN_VIEWFINDER_STROKE,
  ScanQrViewfinderOverlay,
} from '@/scenes/home/ScanQrViewfinderOverlay';
import { ScanQrFrostedMask } from '@/scenes/scan/ScanQrFrostedMask';
import { ScanTopBar } from '@/scenes/scan/ScanTopBar';
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
  const colors = useThemeColors();
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

      {showTopBar ? (
        <View style={styles.topBarHost} collapsable={false} pointerEvents="box-none">
          <ScanTopBar torchOn={torchOn} onToggleTorch={toggleTorch} />
        </View>
      ) : null}
    </View>
  );
}