import { Platform } from 'react-native';

import { biometricsMock } from './biometrics.mock';
import { biometricsNative } from './biometrics.native';
import type { BiometricsService } from './types';

export const biometricsService: BiometricsService =
  Platform.OS === 'web' ? biometricsMock : biometricsNative;

export type { BiometricResult, BiometricsService } from './types';
