import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  EgDivider,
  EgIconArrowRightMiniIos,
  MotionPressable,
} from '@/eds/profile-icons';

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
  const { mode, spacing } = useEdsTheme();

  const rowPaddingH = edsPx(spacing['spacing-4']);
  const rowPaddingV = edsPx(spacing['spacing-3']);
  const iconGap = edsPx(spacing['spacing-3']);
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
          gap: iconGap,
        },
        iconSlot: {
          width: symbolMd,
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
          gap: edsPx(spacing['spacing-2']),
          flexShrink: 0,
        },
        dividerWrap: {
          paddingLeft: dividerInset,
          paddingRight: rowPaddingH,
        },
        pressed: {
          opacity: 0.88,
        },
      }),
    [dividerInset, iconGap, rowPaddingH, rowPaddingV, spacing, symbolMd],
  );

  const trailingChevron =
    showChevron && !value ? (
      <EgIconArrowRightMiniIos mode={mode} size="sm" accessibilityLabel="" />
    ) : null;

  const trailingValueChevron =
    value && showChevron ? (
      <>
        <SceneText variant="bodySmallSecondary" numberOfLines={1}>
          {value}
        </SceneText>
        <EgIconArrowRightMiniIos mode={mode} size="sm" accessibilityLabel="" />
      </>
    ) : null;

  const trailingValueOnly =
    value && !showChevron ? (
      <SceneText variant="bodySmallSecondary" numberOfLines={1}>
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
        style={({ pressed }: { pressed: boolean }) => [
          styles.row,
          pressed && onPress ? styles.pressed : null,
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
