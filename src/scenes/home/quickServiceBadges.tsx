import { Pressable, StyleSheet, View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

type QuickServiceActionBadgeProps = {
  kind: 'remove' | 'removeDecor' | 'add' | 'addDisabled';
  mode: 'light' | 'dark';
  size?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** 快捷入口角标 · `eds-disable-fill` / `eds-add-circle-fill` · 禁用态毛玻璃底 `status-disable-base-weaken`。 */
export function QuickServiceActionBadge({
  kind,
  mode,
  size,
  onPress,
  accessibilityLabel,
}: QuickServiceActionBadgeProps) {
  const { colors, spacing } = useEdsTheme();
  const badgeSize = size ?? edsPx(spacing['spacing-5']);
  const isRemoveIcon = kind === 'remove' || kind === 'removeDecor';
  const disabled =
    kind === 'addDisabled' || (isRemoveIcon && !onPress);
  const removeDanger = kind === 'remove';

  const iconName = isRemoveIcon ? 'eds-disable-fill' : 'eds-add-circle-fill';
  const colorToken = disabled
    ? 'status-disable-base'
    : removeDanger
      ? 'status-danger'
      : 'material-decor';

  const icon = (
    <EgSymbol
      name={iconName}
      mode={mode}
      displayPx={badgeSize}
      fillTone={removeDanger ? 'primary' : disabled ? 'primary' : 'decor'}
      strokeColorToken={colorToken}
      accessibilityLabel=""
    />
  );

  const shell = (
    <View
      style={[
        styles.shell,
        {
          width: badgeSize,
          height: badgeSize,
          borderRadius: edsPx(spacing['radius-full']),
        },
      ]}
    >
      {disabled ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: String(colors['status-disable-base-weaken']) },
          ]}
        />
      ) : null}
      {icon}
    </View>
  );

  if (disabled || !onPress) {
    return (
      <View pointerEvents="none" accessibilityElementsHidden style={styles.hit}>
        {shell}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={styles.hit}
    >
      {shell}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hit: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
