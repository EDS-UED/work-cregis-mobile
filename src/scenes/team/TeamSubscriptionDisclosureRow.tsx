import { EgItem } from '@/eds/item';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamSubscriptionItemLeadIcon } from '@/scenes/team/TeamSubscriptionItemLeadIcon';

type TeamSubscriptionDisclosureRowProps = {
  iconName: string;
  label: string;
  /** 行尾附加说明 · 主｜附加说明。 */
  value?: string;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  showChevron?: boolean;
};

/** 订阅披露行 · `EgItem` · `padSize="lg"` · 无 module 分割线。 */
export function TeamSubscriptionDisclosureRow({
  iconName,
  label,
  value,
  onPress,
  testID,
  accessibilityLabel,
  showChevron = true,
}: TeamSubscriptionDisclosureRowProps) {
  const { mode } = useEdsTheme();

  return (
    <EgItem
      mode={mode}
      testID={testID}
      icon={<TeamSubscriptionItemLeadIcon name={iconName} />}
      label={label}
      labelHeavy
      padSize="lg"
      value={value}
      trailingDisplay="icon"
      trailingEnabled
      showChevron={showChevron}
      showDivider={false}
      showPressFeedback={onPress != null}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? label}
    />
  );
}