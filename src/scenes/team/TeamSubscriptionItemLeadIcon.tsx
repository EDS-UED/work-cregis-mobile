import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';

type TeamSubscriptionItemLeadIconProps = {
  name: string;
};

/** 订阅 `EgItem` 左侧 icon · `symbol-md`。 */
export function TeamSubscriptionItemLeadIcon({ name }: TeamSubscriptionItemLeadIconProps) {
  const { mode } = useEdsTheme();

  return (
    <EgSymbol
      name={name}
      mode={mode}
      size="md"
      fillTone="primary"
      accessibilityLabel=""
    />
  );
}