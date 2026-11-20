import { useCallback, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';
import { useHomeStore } from '@/store';
import type { CompareTeamCenterCardVariant } from '@/scenes/compare/team-center-card/compareTeamCenterCardVariant';
import { CompareTeamCenterCardContent } from '@/scenes/compare/team-center-card/CompareTeamCenterCardContent';
import { TeamCenterNavSwitcherButton } from '@/scenes/team/TeamCenterNavSwitcherButton';
import { TeamSwitcherSheet } from '@/scenes/team/TeamSwitcherSheet';
import { useTeamCenterIosNativeHeaderItems } from '@/scenes/team/useTeamCenterIosNativeHeaderItems';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { useTranslation } from 'react-i18next';

type CompareTeamCenterCardSceneProps = {
  variant: CompareTeamCenterCardVariant;
};

/** 对比页 · 团队中心快照（正文三张菜单卡片 · 底纹 traditional / gray）。 */
function CompareTeamCenterCardSceneShell({ variant }: CompareTeamCenterCardSceneProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const title =
    variant === 'traditional'
      ? t('compare.teamCenterCardTraditionalTitle')
      : t('compare.teamCenterCardGrayTitle');

  const openSwitcher = useCallback(() => setSwitcherOpen(true), []);
  const closeSwitcher = useCallback(() => setSwitcherOpen(false), []);
  const iosNavRight = useTeamCenterIosNativeHeaderItems(openSwitcher);

  useLayoutEffect(() => {
    if (!nativeNavBar) {
      return;
    }
    navigation.setOptions(iosNavRight);
  }, [iosNavRight, nativeNavBar, navigation]);

  return (
    <>
      <SceneScaffold
        title={title}
        showNavBack
        pageBackground={variant === 'traditional' ? 'card' : 'default'}
        overlayNavTrailing={
          nativeNavBar ? undefined : (
            <TeamCenterNavSwitcherButton onPress={openSwitcher} />
          )
        }
      >
        <CompareTeamCenterCardContent variant={variant} />
      </SceneScaffold>
      <TeamSwitcherSheet visible={switcherOpen} onDismiss={closeSwitcher} />
    </>
  );
}

export function CompareTeamCenterCardTraditionalScene() {
  return <CompareTeamCenterCardSceneShell variant="traditional" />;
}

export function CompareTeamCenterCardGrayScene() {
  return <CompareTeamCenterCardSceneShell variant="gray" />;
}