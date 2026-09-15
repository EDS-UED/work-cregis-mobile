import { Platform } from 'react-native';

import { secureStorageMock } from './secureStorage.mock';
import { secureStorageNative } from './secureStorage.native';
import type { SecureStorageService } from './types';

export const secureStorageService: SecureStorageService =
  Platform.OS === 'web' ? secureStorageMock : secureStorageNative;

export type { SecureStorageService } from './types';
