import Constants from 'expo-constants';
import { shouldUseEgTabBarNativeStack } from '@/eds/runtime';

/** 官方 Expo Go（无 Dev Client 自定义原生模块）。 */
export function isExpoGoRuntime(): boolean {
  return (
    Constants.appOwnership === 'expo' ||
    Constants.executionEnvironment === 'storeClient'
  );
}

/** iOS 26+ 系统 Tab — 与 EDS `shouldUseEgTabBarNativeStack()` 同闸（Expo Go 亦须 Native Tabs，禁止 RN `EgTabBar`）。 */
export function shouldUseNativeRootTabBar(): boolean {
  return shouldUseEgTabBarNativeStack();
}
