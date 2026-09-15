import type { BiometricResult, BiometricsService } from './types';

export const biometricsMock: BiometricsService = {
  async isAvailable() {
    return true;
  },
  async authenticate(promptMessage: string): Promise<BiometricResult> {
    void promptMessage;
    await new Promise((resolve) => setTimeout(resolve, 450));
    return { success: true };
  },
};
