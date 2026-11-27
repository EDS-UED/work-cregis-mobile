import type { ComponentProps } from 'react';

import { EgItem } from '@/eds/item';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { PersonalCenterItemLeadIcon } from '@/scenes/profile/PersonalCenterItemLeadIcon';

type EgItemProps = ComponentProps<typeof EgItem>;

type PersonalCenterSettingsRowProps = {
  testID: string;
  iconName: string;
  label: string;
  showDivider?: boolean;
  onPress?: () => void;
} & Pick<
  EgItemProps,
  'value' | 'trailingDisplay' | 'menuItems' | 'selectedMenuId' | 'onMenuSelect' | 'accessibilityLabel'
>;

/** 个人中心披露行 · `EgItem` · `padSize="lg"` · `symbol-md` 左图。 */
export function PersonalCenterSettingsRow({
  testID,
  iconName,
  label,
  showDivider = true,
  onPress,
  value,
  trailingDisplay = 'icon',
  menuItems,
  selectedMenuId,
  onMenuSelect,
  accessibilityLabel,
}: PersonalCenterSettingsRowProps) {
  const { mode } = useEdsTheme();
  const isMenu = trailingDisplay === 'menu';

  return (
    <EgItem
      mode={mode}
      testID={testID}
      icon={<PersonalCenterItemLeadIcon name={iconName} />}
      label={label}
      value={value}
      padSize="lg"
      trailingDisplay={trailingDisplay}
      trailingEnabled
      showChevron={!isMenu}
      menuItems={menuItems}
      selectedMenuId={selectedMenuId}
      onMenuSelect={onMenuSelect}
      showDivider={showDivider}
      showPressFeedback={isMenu || onPress != null}
      onPress={isMenu ? () => undefined : (onPress ?? (() => undefined))}
      accessibilityLabel={accessibilityLabel ?? label}
    />
  );
}