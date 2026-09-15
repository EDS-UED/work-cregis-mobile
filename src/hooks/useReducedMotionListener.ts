import { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

import { useAppStore } from '@/store';

export function useReducedMotionListener() {
  const setReducedMotion = useAppStore((state) => state.setReducedMotion);

  useEffect(() => {
    let mounted = true;

    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReducedMotion(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => setReducedMotion(enabled),
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [setReducedMotion]);
}
