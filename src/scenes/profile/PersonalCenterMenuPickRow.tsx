import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { EgDivider, EgSymbol, MotionPressable } from '@/eds/profile-icons';
import type { EgMenuItem, EgMenuTriggerContext } from '@/eds/menu';
import { EgMenu, shouldUseEgMenuNativeStack } from '@/eds/menu';

import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

const MENU_TRAILING_ICON = 'eds-arrow-integrated-sort-mini';

type PersonalCenterMenuPickRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
  items: EgMenuItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  isLast?: boolean;
  testID?: string;
};

/**
 * 偏好组 · `EgMenu` 触发器为右侧「预览文案 + `eds-arrow-integrated-sort-mini`」插槽；整行保留点按样式与动效。
 * iOS 26+ 系统菜单只响应插槽自身点按（`ctx.open` 为空操作）；RN 浮层整行点按亦调 `ctx.open`。
 */
export function PersonalCenterMenuPickRow({
  icon,
  label,
  value,
  items,
  selectedId,
  onSelect,
  isLast = false,
  testID,
}: PersonalCenterMenuPickRowProps) {
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const nativeMenu = shouldUseEgMenuNativeStack();
  const openMenuRef = useRef<(() => void) | null>(null);

  const rowPaddingH = edsPx(spacing['spacing-4']);
  const rowPaddingV = edsPx(spacing['spacing-4']);
  const rowTapRadius = edsPx(spacing['radius-md']);
  const iconGap = edsPx(spacing['spacing-4']);
  const symbolMd = edsPx(spacing['symbol-sm']);
  const dividerInset = rowPaddingH + symbolMd + iconGap;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: rowPaddingH,
          paddingVertical: rowPaddingV,
          minHeight: edsPx(spacing['input-md']),
        },
        rowPressed: {
          backgroundColor: String(colors['event-tap']),
          borderRadius: rowTapRadius,
        },
        iconSlot: {
          width: symbolMd,
          marginRight: iconGap,
          alignItems: 'center',
          justifyContent: 'center',
        },
        labelWrap: {
          flex: 1,
          minWidth: 0,
        },
        trailing: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: edsPx(spacing['spacing-1-5']),
        },
        trailingValue: {
          textAlign: 'right',
        },
        dividerWrap: {
          paddingLeft: dividerInset,
          paddingRight: rowPaddingH,
        },
      }),
    [
      colors,
      dividerInset,
      iconGap,
      rowPaddingH,
      rowPaddingV,
      rowTapRadius,
      spacing,
      symbolMd,
    ],
  );

  const leading = (
    <>
      <View style={styles.iconSlot}>{icon}</View>
      <View style={styles.labelWrap}>
        <SceneText variant="body" numberOfLines={1}>
          {label}
        </SceneText>
      </View>
    </>
  );

  const trailing = (
    <View style={styles.trailing} pointerEvents={nativeMenu ? 'auto' : 'none'}>
      <SceneText
        variant="bodySmallSecondary"
        numberOfLines={1}
        style={styles.trailingValue}
      >
        {value}
      </SceneText>
      <EgSymbol
        name={MENU_TRAILING_ICON}
        mode={mode}
        size="sm"
        strokeColorToken="text-base-secondary"
        accessibilityLabel=""
      />
    </View>
  );

  const menuProps = {
    mode,
    items,
    selectedId,
    onSelect: (id: string) => onSelect(id),
    align: 'end' as const,
    testID: testID ? `${testID}-menu` : 'profile-menu',
    accessibilityLabel: label,
  };

  const rowBody = (
    <MotionPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => openMenuRef.current?.()}
      pressScaleDirection="down"
      pressIntensity="xs"
      style={({ pressed }) => [styles.row, pressed ? styles.rowPressed : null]}
    >
      {leading}
      <EgMenu
        {...menuProps}
        trigger={(ctx: EgMenuTriggerContext) => {
          openMenuRef.current = ctx.open;
          return trailing;
        }}
      />
    </MotionPressable>
  );

  return (
    <>
      {rowBody}
      {!isLast ? (
        <View style={styles.dividerWrap}>
          <EgDivider variant="module" mode={mode} />
        </View>
      ) : null}
    </>
  );
}
