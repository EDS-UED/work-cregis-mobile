import type { PropsWithChildren } from 'react';
import { Pressable, type PressableProps, StyleSheet } from 'react-native';

import { useAppStore, useDevInspectStore, type InspectSelection } from '@/store';

type InspectTargetProps = PropsWithChildren<
  PressableProps & {
    inspect: InspectSelection;
  }
>;

export function InspectTarget({ inspect, children, onPress, style, ...rest }: InspectTargetProps) {
  const inspectEnabled = useAppStore((state) => state.previewMode === 'inspect');
  const pinSelection = useDevInspectStore((state) => state.pinSelection);

  const handlePress: PressableProps['onPress'] = (event) => {
    if (inspectEnabled) {
      pinSelection(inspect);
      return;
    }
    onPress?.(event);
  };

  return (
    <Pressable
      {...rest}
      onPress={handlePress}
      style={({ pressed }) => [
        typeof style === 'function' ? style({ pressed }) : style,
        inspectEnabled && styles.inspectable,
        pressed && !inspectEnabled && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inspectable: {
    borderWidth: 1,
    borderColor: '#5f224366',
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.85,
  },
});
