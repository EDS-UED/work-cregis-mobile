import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { mobileMotion } from '@eds-evergreen/mobile/animations';

const pushTiming = mobileMotion.timing.navigationPush;

export const stackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'slide_from_right',
  gestureEnabled: true,
  fullScreenGestureEnabled: Platform.OS === 'ios',
  animationDuration: pushTiming.duration,
};

export const modalScreenOptions: NativeStackNavigationOptions = {
  presentation: 'modal',
  animation: 'slide_from_bottom',
  gestureEnabled: true,
};
