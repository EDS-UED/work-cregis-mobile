import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { edsNavigationPushDurationMs } from '@/utils/edsMotion';

const pushDurationMs = edsNavigationPushDurationMs();

export const stackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'slide_from_right',
  gestureEnabled: true,
  fullScreenGestureEnabled: Platform.OS === 'ios',
  animationDuration: pushDurationMs,
};

/** 子页 push（如个人中心）— 双端统一右进右出，避免 Android `fade_from_bottom` 像 modal。 */
export const pushSlideScreenOptions: NativeStackNavigationOptions = {
  animation: 'slide_from_right',
  gestureEnabled: true,
  fullScreenGestureEnabled: Platform.OS === 'ios',
  animationDuration: pushDurationMs,
};

export const modalScreenOptions: NativeStackNavigationOptions = {
  presentation: 'modal',
  animation: 'slide_from_bottom',
  gestureEnabled: true,
};
