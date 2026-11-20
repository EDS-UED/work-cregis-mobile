import { StyleSheet, View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

const TRAILING_ICON = 'eds-arrow-right-mini-ios';

type TeamCenterAccountRowTrailingProps = {
  mode: 'light' | 'dark';
};

/** 团队 / 版本账户行 · 右箭头槽（与 `symbol-sm` 同宽，两卡右缘对齐）。 */
export function TeamCenterAccountRowTrailing({ mode }: TeamCenterAccountRowTrailingProps) {
  const { spacing } = useEdsTheme();
  const slotW = edsPx(spacing['symbol-sm']);

  return (
    <View style={[styles.slot, { width: slotW }]}>
      <EgSymbol
        name={TRAILING_ICON}
        mode={mode}
        size="sm"
        strokeColorToken="text-base-secondary"
        accessibilityLabel=""
      />
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});