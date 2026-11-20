import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { EgDataListRowPressable } from '@/eds/data-list';
import {
  EgItem,
  EG_ITEM_MIN_HEIGHT,
  EG_ITEM_PAD_V,
  EG_ITEM_TAP_RADIUS,
  EG_ITEM_TRAILING_GAP,
  type EgItemProps,
} from '@/eds/item';
import { EgSymbol } from '@/eds/home-ui';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';

import {
  TEAM_CENTER_ACCOUNT_ROW_PAD_H,
  TEAM_CENTER_EG_ITEM_ICON_LABEL_GAP,
  TEAM_CENTER_EG_ITEM_LIST_ROW_PAD,
  TEAM_CENTER_EG_ITEM_PLAN_ROW_PAD,
  teamCenterEgItemIconGapStyle,
  teamCenterEgItemRowStyle,
} from '@/scenes/team/teamCenterEgItemLayout';
import { edsPx } from '@/utils/edsTheme';

type TeamCenterEgItemRowPad =
  | typeof TEAM_CENTER_ACCOUNT_ROW_PAD_H
  | typeof TEAM_CENTER_EG_ITEM_PLAN_ROW_PAD
  | typeof TEAM_CENTER_EG_ITEM_LIST_ROW_PAD;

type TeamCenterEgItemProps = EgItemProps & {
  /** 行左右内边距 token（默认套餐行 `spacing-3`）。 */
  rowPad?: TeamCenterEgItemRowPad;
  /** 左 icon 与 `label` 间距收至 `spacing-2`（无 `labelColor` 时走 DS `EgItem`）。 */
  compactIconLabelGap?: boolean;
  /** 主文案色（套餐版本行 · 同切换列表；`label` 在 `labelWrap` 完整展示，不进 icon 槽）。 */
  labelColor?: string;
  style?: StyleProp<ViewStyle>;
};

function wrapIcon(icon: ReactNode, gapStyle: ViewStyle): ReactNode {
  if (icon == null) {
    return icon;
  }
  return <View style={gapStyle}>{icon}</View>;
}

const TRAILING_ICON = 'eds-arrow-right-mini-ios';

type TintedLabelRowProps = Pick<
  TeamCenterEgItemProps,
  | 'testID'
  | 'mode'
  | 'icon'
  | 'label'
  | 'labelHeavy'
  | 'labelColor'
  | 'showChevron'
  | 'onPress'
  | 'pressIntensity'
  | 'accessibilityLabel'
  | 'style'
  | 'rowPad'
>;

/** 与 `EgItem` 同行级度量 · 支持 `labelColor` + `spacing-2` icon–label。 */
function TeamCenterEgItemTintedLabelRow({
  testID,
  mode = 'light',
  icon,
  label,
  labelHeavy = false,
  labelColor,
  showChevron = true,
  onPress,
  pressIntensity = 'xs',
  accessibilityLabel,
  style,
  rowPad = TEAM_CENTER_EG_ITEM_PLAN_ROW_PAD,
}: TintedLabelRowProps) {
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();
  const rowPadH = teamCenterEgItemRowStyle(spacing, rowPad).paddingHorizontal;
  const iconLabelGap = edsPx(spacing[TEAM_CENTER_EG_ITEM_ICON_LABEL_GAP]);
  const interactive = showChevron && onPress != null;
  const tapBackground = String(colors['event-tap']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'stretch',
          width: '100%',
          minHeight: EG_ITEM_MIN_HEIGHT,
          paddingHorizontal: typeof rowPadH === 'number' ? rowPadH : undefined,
          paddingVertical: EG_ITEM_PAD_V,
          borderRadius: EG_ITEM_TAP_RADIUS,
          borderCurve: 'continuous',
        },
        iconWrap: {
          marginRight: iconLabelGap,
        },
        labelWrap: {
          flex: 1,
          minWidth: 0,
        },
        trailing: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: EG_ITEM_TRAILING_GAP,
          flexShrink: 0,
          marginLeft: 'auto',
        },
      }),
    [iconLabelGap, rowPadH],
  );

  const rowShell = (pressed: boolean) =>
    StyleSheet.flatten([
      styles.row,
      style,
      interactive && pressed ? { backgroundColor: tapBackground } : null,
    ]);

  const labelVariant = labelHeavy ? 'bodySemibold' : 'body';

  const body = (
    <>
      {icon != null ? <View style={styles.iconWrap}>{icon}</View> : null}
      <View style={styles.labelWrap}>
        <SceneText
          variant={labelVariant}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={labelColor ? { color: labelColor } : undefined}
        >
          {label}
        </SceneText>
      </View>
      {showChevron ? (
        <View style={styles.trailing}>
          <EgSymbol
            name={TRAILING_ICON}
            mode={mode}
            size="sm"
            strokeColorToken="text-base-secondary"
            accessibilityLabel=""
          />
        </View>
      ) : null}
    </>
  );

  const a11y = accessibilityLabel ?? label;

  if (interactive) {
    return (
      <EgDataListRowPressable
        testID={testID}
        accessibilityLabel={a11y}
        onPress={onPress}
        pressIntensity={pressIntensity}
        style={({ pressed }) => rowShell(pressed)}
      >
        {body}
      </EgDataListRowPressable>
    );
  }

  return (
    <View testID={testID} accessibilityLabel={a11y} style={rowShell(false)}>
      {body}
    </View>
  );
}

/**
 * 团队中心 · `EgItem` 业务覆写（边距、icon–label 间距、`labelColor` 套餐行）。
 */
export function TeamCenterEgItem({
  rowPad = TEAM_CENTER_EG_ITEM_PLAN_ROW_PAD,
  compactIconLabelGap = false,
  labelColor,
  icon,
  style,
  label,
  ...rest
}: TeamCenterEgItemProps) {
  const { spacing } = useEdsTheme();

  if (labelColor != null && label != null && label.length > 0) {
    return (
      <TeamCenterEgItemTintedLabelRow
        rowPad={rowPad}
        icon={icon}
        label={label}
        labelColor={labelColor}
        style={style}
        {...rest}
      />
    );
  }

  const rowStyle = teamCenterEgItemRowStyle(spacing, rowPad);
  const iconGapStyle =
    compactIconLabelGap && icon != null
      ? teamCenterEgItemIconGapStyle(spacing)
      : {};

  return (
    <EgItem
      {...rest}
      label={label ?? ''}
      icon={wrapIcon(icon, iconGapStyle)}
      style={[rowStyle, style]}
    />
  );
}

export {
  TEAM_CENTER_EG_ITEM_ICON_LABEL_GAP,
  TEAM_CENTER_EG_ITEM_LIST_ROW_PAD,
  TEAM_CENTER_EG_ITEM_PLAN_ROW_PAD,
} from '@/scenes/team/teamCenterEgItemLayout';