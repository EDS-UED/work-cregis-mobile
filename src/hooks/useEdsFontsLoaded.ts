import { useFonts } from 'expo-font';

/** dist 内 require 字体 ttf，与 EDS `fonts-native.js` 同源。 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const edsFontAssets = require('../../node_modules/@eds-evergreen/mobile/dist/tokens/js/fonts-native.js')
  .default as Record<string, number>;

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
