import { useCallback, useRef } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  BarcodeScanningResult,
  CameraView,
  type PermissionResponse,
} from 'expo-camera';

import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type ScanFullScreenCameraProps = {
  permission: PermissionResponse | null;
  requestPermission: () => Promise<PermissionResponse>;
  torchEnabled: boolean;
  onCameraReady?: () => void;
};

/** 全屏相机层 · 铺满扫码页，供 QR 识别（权限态由 `ScanPageContent` 单点持有）。 */
export function ScanFullScreenCamera({
  permission,
  requestPermission,
  torchEnabled,
  onCameraReady,
}: ScanFullScreenCameraProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();
  const scanLockRef = useRef(false);

  const onBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      const data = result.data?.trim();
      if (!data || scanLockRef.current) {
        return;
      }
      scanLockRef.current = true;
      Alert.alert(t('home.scanResultTitle'), data, [
        {
          text: t('home.scanAgain'),
          onPress: () => {
            scanLockRef.current = false;
          },
        },
      ]);
    },
    [t],
  );

  const openSettings = useCallback(() => {
    void Linking.openSettings();
  }, []);

  const handleCameraReady = useCallback(() => {
    onCameraReady?.();
  }, [onCameraReady]);

  const fallbackBg = String(colors['material-same-black']);

  if (!permission) {
    return <View style={[styles.fill, { backgroundColor: fallbackBg }]} />;
  }

  if (!permission.granted) {
    const canAskAgain = permission.canAskAgain !== false;
    return (
      <View style={[styles.fill, styles.permission, { backgroundColor: fallbackBg }]}>
        <SceneText variant="bodySmallSecondary" style={{ textAlign: 'center' }}>
          {t('home.scanPermissionMessage')}
        </SceneText>
        {canAskAgain ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => void requestPermission()}
            style={{
              paddingHorizontal: edsPx(spacing['spacing-4']),
              paddingVertical: edsPx(spacing['spacing-2']),
              borderRadius: edsPx(spacing['radius-md']),
              backgroundColor: String(colors['material-card-deep']),
            }}
          >
            <SceneText variant="bodySemibold">{t('home.scanGrantPermission')}</SceneText>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={openSettings}
            style={{
              paddingHorizontal: edsPx(spacing['spacing-4']),
              paddingVertical: edsPx(spacing['spacing-2']),
              borderRadius: edsPx(spacing['radius-md']),
              backgroundColor: String(colors['material-card-deep']),
            }}
          >
            <SceneText variant="bodySemibold">{t('home.scanOpenSettings')}</SceneText>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <CameraView
      style={styles.fill}
      facing="back"
      enableTorch={torchEnabled}
      barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      onBarcodeScanned={onBarcodeScanned}
      onCameraReady={handleCameraReady}
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFill,
  },
  permission: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
});