import { useTranslation } from 'react-i18next';

import { EgGlassCapsule } from '@/eds/button-glass';
import { useEdsTheme } from '@/hooks/useEdsTheme';

type MessagesNavClearButtonProps = {
  onPress?: () => void;
};

/** 通知 NavBar · 标记为已读（`EgGlassCapsule` 文本胶囊）。 */
export function MessagesNavClearButton({ onPress }: MessagesNavClearButtonProps) {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();

  return (
    <EgGlassCapsule
      kind="text"
      size="md"
      mode={mode}
      label={t('messages.clear')}
      onPress={onPress}
      accessibilityLabel={t('messages.clear')}
      testID="messages-nav-clear"
    />
  );
}
