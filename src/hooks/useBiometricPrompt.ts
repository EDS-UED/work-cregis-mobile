import { useCallback, useState } from 'react';
import { mobileMotion } from '@eds-evergreen/mobile/animations';
import { withSpring, withTiming } from 'react-native-reanimated';

import { useAppStore } from '@/store';

export function useBiometricPrompt() {
  const reducedMotion = useAppStore((state) => state.reducedMotion);
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  const enter = reducedMotion
    ? withTiming(1, { duration: 0 })
    : withSpring(1, mobileMotion.spring.default);

  const exit = reducedMotion
    ? withTiming(0, { duration: 0 })
    : withSpring(0, mobileMotion.spring.default);

  return {
    visible,
    open,
    close,
    enter,
    exit,
    motionScene: 'motion-flotation' as const,
    motionPreset: 'spring.default' as const,
  };
}
