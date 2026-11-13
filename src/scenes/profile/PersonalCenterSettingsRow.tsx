import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { EgDivider, EgSymbol, MotionPressable } from '@/eds/profile-icons';

import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type PersonalCenterSettingsRowProps = {
  icon: ReactNode;
  label: string;
  value?: string;
  showChevron?: boolean;
  onPress?: () => void;
  isLast?: boolean;
  testID?: string;
};

export function PersonalCenterSettingsRow({
  icon,
  label,
  value,
  showChevron = true,
  onPress,
  isLast = false,
  testID,
}: PersonalCenterSettingsRowProps) {
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();

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
          flexShrink: 0,
          marginLeft: 'auto',
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

  const trailingChevron =
    showChevron && !value ? (
      <EgSymbol
        name="eds-arrow-right-mini-ios"
        mode={mode}
        size="sm"
        strokeColorToken="text-base-secondary"
        accessibilityLabel=""
      />
    ) : null;

  const trailingValueChevron =
    value && showChevron ? (
      <>
        <SceneText
          variant="bodySmallSecondary"
          numberOfLines={1}
          style={styles.trailingValue}
        >
          {value}
        </SceneText>
        <EgSymbol
          name="eds-arrow-right-mini-ios"
          mode={mode}
          size="sm"
          strokeColorToken="text-base-secondary"
          accessibilityLabel=""
        />
      </>
    ) : null;

  const trailingValueOnly =
    value && !showChevron ? (
      <SceneText
        variant="bodySmallSecondary"
        numberOfLines={1}
        style={styles.trailingValue}
      >
        {value}
      </SceneText>
    ) : null;

  return (
    <>
      <MotionPressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        disabled={!onPress}
        pressScaleDirection="down"
        pressIntensity="xs"
        style={({ pressed }) => [
          styles.row,
          pressed && onPress ? styles.rowPressed : null,
        ]}
      >
        <View style={styles.iconSlot}>{icon}</View>
        <View style={styles.labelWrap}>
          <SceneText variant="body" numberOfLines={1}>
            {label}
          </SceneText>
        </View>
        <View style={styles.trailing}>
          {trailingValueChevron ?? trailingValueOnly ?? trailingChevron}
        </View>
      </MotionPressable>
      {!isLast ? (
        <View style={styles.dividerWrap}>
          <EgDivider variant="module" mode={mode} />
        </View>
      ) : null}
    </>
  );
}
