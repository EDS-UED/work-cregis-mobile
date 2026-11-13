import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgSymbol } from '@/eds/home-ui';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { ScanQrViewfinder } from '@/scenes/home/ScanQrViewfinder';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type ScanPageContentProps = {
  contentStyle?: ViewStyle;
};

/** 扫码页正文 · page-shot 与 Stack 页共用。 */
export function ScanPageContent({ contentStyle }: ScanPageContentProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [torchOn, setTorchOn] = useState(false);
  const viewfinderSize = Math.min(windowWidth - edsPx(spacing['spacing-8']) * 2, 320);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        page: {
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: edsPx(spacing['spacing-8']),
        },
        caption: {
          textAlign: 'center',
          paddingHorizontal: edsPx(spacing['spacing-4']),
        },
        torch: {
          width: edsPx(spacing['capsule-lg']),
          height: edsPx(spacing['capsule-lg']),
          borderRadius: edsPx(spacing['radius-full']),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: String(colors['material-card-deep']),
        },
        torchPressed: { opacity: 0.88 },
      }),
    [colors, spacing],
  );

  return (
    <View style={[styles.page, contentStyle]}>
      <ScanQrViewfinder size={viewfinderSize} />
      <SceneText variant="bodyMediumStrong" style={styles.caption}>
        {t('home.scanTransferHint')}
      </SceneText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('home.scanTorch')}
        accessibilityState={{ selected: torchOn }}
        onPress={() => setTorchOn((prev) => !prev)}
        style={({ pressed }) => [styles.torch, pressed ? styles.torchPressed : null]}
      >
        <EgSymbol
          name="eds-light"
          mode={mode}
          size="md"
          strokeColorToken={torchOn ? 'text-base-primary' : 'text-base-secondary'}
          accessibilityLabel=""
        />
      </Pressable>
    </View>
  );
}
