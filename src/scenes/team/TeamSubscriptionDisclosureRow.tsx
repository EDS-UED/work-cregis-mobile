import { EgItem } from '@/eds/item';
import { useEdsTheme } from '@/hooks/useEdsTheme';

type TeamSubscriptionDisclosureRowProps = {
  label: string;
  /** 副文本（用量 / 个数）· 与 `value` 二选一。 */
  subLabel?: string;
  /** 行尾附属说明 · 权益三行关闭时勿传。 */
  value?: string;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  showChevron?: boolean;
};

/** 订阅披露行 · `EgItem` · `padSize="md"` · 无 module 分割线。 */
export function TeamSubscriptionDisclosureRow({
  label,
  subLabel,
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
      label={label}
      labelHeavy
      padSize="md"
      subLabel={subLabel}
      value={subLabel != null ? undefined : value}
      showChevron={showChevron}
      showDivider={false}
      showPressFeedback={onPress != null}
      onPress={onPress}
      accessibilityLabel={
        accessibilityLabel ??
        (subLabel != null ? `${label}, ${subLabel}` : label)
      }
    />
  );
}