import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { useThemeColors } from '@/hooks/useEffectiveTheme';
import type { MotionPresetKey, MotionScene } from '@/types/app';

type BiometricPromptSheetProps = {
  visible: boolean;
  onClose: () => void;
  motionScene: MotionScene;
  motionPreset: MotionPresetKey;
};

export function BiometricPromptSheet({
  visible,
  onClose,
  motionScene,
  motionPreset,
}: BiometricPromptSheetProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.center}>
          <Pressable onPress={(event) => event.stopPropagation()}>
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: colors.flotation,
                  borderColor: colors['stroke-divider'],
                },
              ]}
              accessibilityLabel={`${motionScene}:${motionPreset}`}
            >
              <Text style={[styles.title, { color: colors['text-base-primary'] }]}>
                {t('profile.biometrics')}
              </Text>
              <Text style={{ color: colors['text-base-secondary'] }}>{t('profile.biometricsMock')}</Text>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#02030480',
    justifyContent: 'flex-end',
  },
  center: {
    padding: 16,
  },
  sheet: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
