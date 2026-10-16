import { useFonts } from 'expo-font';
import edsFontAssets from '@eds-evergreen/mobile/tokens/fonts-native';

/** 业务 UI 仅 EDSText 四档；不阻塞加载 IBM Plex Mono。 */
const edsSansFontAssets = {
  'EDSText-Regular': edsFontAssets['EDSText-Regular'],
  'EDSText-Medium': edsFontAssets['EDSText-Medium'],
  'EDSText-SemiBold': edsFontAssets['EDSText-SemiBold'],
  'EDSText-Bold': edsFontAssets['EDSText-Bold'],
};

export function useEdsFontsLoaded() {
  const [loaded, error] = useFonts(edsSansFontAssets);
  return { loaded, error };
}
