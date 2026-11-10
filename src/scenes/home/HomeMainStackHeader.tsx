import { StyleSheet, View } from 'react-native';
import {
  EG_NAV_BAR_PADDING_BOTTOM,
  EG_NAV_BAR_PADDING_HORIZONTAL,
  EG_NAV_BAR_PADDING_TOP,
} from '@/eds/nav-bar';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { HomeNavLeading, HomeNavTrailing } from '@/scenes/home/HomeNavBarParts';
import { edsPx } from '@/utils/edsTheme';

/**
 * iOS 26+ HomeMain — Stack `header` 槽（可点按；勿再用 overlay 叠在原生 Nav 上）。
 */
export function HomeMainStackHeader() {
  const { spacing } = useEdsTheme();

  return (
    <View
      style={[styles.row, { gap: edsPx(spacing['spacing-3']) }]}
      collapsable={false}
      pointerEvents="box-none"
    >
      <HomeNavLeading />
      <HomeNavTrailing />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingTop: EG_NAV_BAR_PADDING_TOP,
    paddingBottom: EG_NAV_BAR_PADDING_BOTTOM,
    paddingHorizontal: EG_NAV_BAR_PADDING_HORIZONTAL,
  },
});
