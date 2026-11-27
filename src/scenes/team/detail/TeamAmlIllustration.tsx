import { useWindowDimensions, View } from 'react-native';

import CregisMobileAml from '../../../../assets/cregis_mobile_aml.svg';

/** AML 首屏插画 · 稿面 `cregis_mobile_aml.svg`（390×360 · 等比铺满屏宽）。 */
export function TeamAmlIllustration() {
  const { width } = useWindowDimensions();
  const height = Math.round((width * 360) / 390);

  return (
    <View style={{ alignItems: 'center', alignSelf: 'stretch' }}>
      <CregisMobileAml width={width} height={height} accessibilityLabel="AML" />
    </View>
  );
}