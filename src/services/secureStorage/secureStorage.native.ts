import * as SecureStore from 'expo-secure-store';

import type { SecureStorageService } from './types';

export const secureStorageNative: SecureStorageService = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  deleteItem: (key) => SecureStore.deleteItemAsync(key),
};
