import type { SecureStorageService } from './types';

const memory = new Map<string, string>();

export const secureStorageMock: SecureStorageService = {
  async getItem(key) {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return memory.get(key) ?? null;
  },
  async setItem(key, value) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
    memory.set(key, value);
  },
  async deleteItem(key) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      return;
    }
    memory.delete(key);
  },
};
