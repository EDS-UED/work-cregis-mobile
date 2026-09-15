export type BiometricResult =
  | { success: true }
  | { success: false; reason: 'unavailable' | 'cancelled' | 'failed' };

export type BiometricsService = {
  isAvailable: () => Promise<boolean>;
  authenticate: (promptMessage: string) => Promise<BiometricResult>;
};
