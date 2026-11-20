import { EgButtonGlass } from '@/eds/button-glass';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useHomeStore } from '@/store';

type TeamCenterNavSwitcherButtonProps = {
  onPress: () => void;
};

/** 团队中心 Nav 右栏 — 文本胶囊 · 点开 `TeamSwitcherSheet`。 */
export function TeamCenterNavSwitcherButton({
  onPress,
}: TeamCenterNavSwitcherButtonProps) {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);
  const switchLabel = t('team.switchNav');

  return (
    <EgButtonGlass
      kind="text"
      size="md"
      mode={mode}
      label={switchLabel}
      onPress={onPress}
      accessibilityLabel={t('team.openSwitcher', { name: teamDisplayName })}
      testID="team-center-nav-switcher"
    />
  );
}