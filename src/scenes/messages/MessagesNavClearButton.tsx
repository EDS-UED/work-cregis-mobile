import { EgButtonGlass } from '@/eds/button-glass';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';

type MessagesNavClearButtonProps = {
  onPress?: () => void;
};

/** 通知 NavBar · 已读 / 清空（`eds-clear`）。未读红点标在列表项图标右上角。 */
export function MessagesNavClearButton({ onPress }: MessagesNavClearButtonProps) {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();

  return (
    <EgButtonGlass
      kind="icon"
      iconCount={1}
      size="md"
      mode={mode}
      icon="eds-clear"
      onPress={onPress}
      accessibilityLabel={t('messages.clear')}
      testID="messages-nav-clear"
    />
  );
}