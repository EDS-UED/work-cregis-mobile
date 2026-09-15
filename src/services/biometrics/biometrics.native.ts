import * as LocalAuthentication from 'expo-local-authentication';

import type { BiometricResult, BiometricsService } from './types';

export const biometricsNative: BiometricsService = {
  async isAvailable() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && enrolled;
  },
  async authenticate(promptMessage: string): Promise<BiometricResult> {
    const available = await this.isAvailable();
    if (!available) {
      return { success: false, reason: 'unavailable' };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    if (result.success) {
      return { success: true };
    }

    if (result.error === 'user_cancel' || result.error === 'system_cancel') {
      return { success: false, reason: 'cancelled' };
    }

    return { success: false, reason: 'failed' };
  },
};
