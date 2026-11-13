import { useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

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
  const isFocused = useIsFocused();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

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
          backgroundColor: String(colors['material-same-black']),
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
    <View style={[styles.page, contentStyle]}>
      <GlassBlurBackdrop style={StyleSheet.absoluteFill} active={isFocused}>
        <ScanFullScreenCamera
          torchEnabled={torchOn}
          onCameraReady={() => setCameraReady(true)}
          onPermissionChange={setPermissionGranted}
        />
      </GlassBlurBackdrop>

      {permissionGranted ? (
        <>
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
        </>
      ) : null}

      {showTopBar ? <ScanTopBar torchOn={torchOn} onToggleTorch={toggleTorch} /> : null}
    </View>
  );
}
