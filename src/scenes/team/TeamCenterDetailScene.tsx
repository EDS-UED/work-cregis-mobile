import type { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import type { HomeStackParamList } from '@/navigation/types';
import { useHideTabBarForInnerPage } from '@/hooks/useHideTabBarForInnerPage';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { TeamCenterDetailBody } from '@/scenes/team/detail/TeamCenterDetailBody';
import { TeamMemberManagementScene } from '@/scenes/team/detail/TeamMemberManagementScene';
import { TeamAddressBookManagementScene } from '@/scenes/team/detail/TeamAddressBookManagementScene';
import { TeamRoleManagementScene } from '@/scenes/team/detail/TeamRoleManagementScene';
import { TeamAmlDetailActions } from '@/scenes/team/detail/TeamAmlDetailActions';
import { teamAmlActionsChromeReserve } from '@/scenes/team/detail/teamAmlActionsLayout';
import { TeamInfoDetailActions } from '@/scenes/team/detail/TeamInfoDetailActions';
import { teamInfoActionsChromeReserve } from '@/scenes/team/detail/teamInfoActionsLayout';
import { useTeamCenterDetailNavExtras } from '@/scenes/team/detail/useTeamCenterDetailNavExtras';
import { teamCenterDetailTitleKey } from '@/scenes/team/teamCenterDetail';

type TeamCenterDetailSceneProps = {
  route: RouteProp<HomeStackParamList, 'TeamCenterDetail'>;
};

/** 团队中心子页 · 按路由 id 挂载 EgDataList 等业务正文。 */
export function TeamCenterDetailScene({ route }: TeamCenterDetailSceneProps) {
  const { t } = useTranslation();
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const { id } = route.params;
  const title = t(teamCenterDetailTitleKey(id));
  const overlayNavTrailing = useTeamCenterDetailNavExtras(id);
  const { spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const amlActionsChromeReserve = teamAmlActionsChromeReserve(spacing, insets.bottom);
  const teamInfoChromeReserve = teamInfoActionsChromeReserve(spacing, insets.bottom);

  useHideTabBarForInnerPage(true);

  const listBacked = id !== 'aml' && id !== 'teamInfo' && id !== 'teamAccount';

  if (id === 'memberManagement') {
    return (
      <TeamMemberManagementScene
        title={title}
        overlayNavTrailing={nativeNavBar ? undefined : overlayNavTrailing ?? undefined}
      />
    );
  }

  if (id === 'roleManagement') {
    return (
      <TeamRoleManagementScene
        title={title}
        overlayNavTrailing={nativeNavBar ? undefined : overlayNavTrailing ?? undefined}
      />
    );
  }

  if (id === 'addressBook') {
    return (
      <TeamAddressBookManagementScene
        title={title}
        overlayNavTrailing={nativeNavBar ? undefined : overlayNavTrailing ?? undefined}
      />
    );
  }

  const amlPage = id === 'aml';
  const teamInfoPage = id === 'teamInfo';
  const shortPageLayout = listBacked || amlPage || teamInfoPage;

  return (
    <SceneScaffold
      title={title}
      showNavBack
      showNavTitle={!amlPage && !teamInfoPage}
      shortPageScrollLayout={shortPageLayout}
      bodyShowsVerticalScrollIndicator={amlPage || teamInfoPage ? false : undefined}
      contentPaddingHorizontal={amlPage || teamInfoPage ? 0 : undefined}
      contentPaddingBottom={amlPage || teamInfoPage ? 0 : undefined}
      navToContentGap={amlPage ? 0 : undefined}
      fixedBottomChrome={
        amlPage ? (
          <TeamAmlDetailActions />
        ) : teamInfoPage ? (
          <TeamInfoDetailActions />
        ) : undefined
      }
      fixedBottomChromeReserve={
        amlPage
          ? amlActionsChromeReserve
          : teamInfoPage
            ? teamInfoChromeReserve
            : undefined
      }
      pageBackground="default"
      overlayNavTrailing={nativeNavBar ? undefined : overlayNavTrailing ?? undefined}
    >
      <TeamCenterDetailBody id={id} />
    </SceneScaffold>
  );
}