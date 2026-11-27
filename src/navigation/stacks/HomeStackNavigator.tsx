import { createCregisPageStackNavigator } from '@/navigation/createCregisPageStackNavigator';

import { HomeMainScreen } from '@/scenes/home/HomeMainScreen';
import { AssetDistributionScene } from '@/scenes/home/AssetDistributionScene';
import { useAssetDistributionScreenOptions } from '@/scenes/home/useAssetDistributionScreenOptions';
import { AnnouncementDetailScene } from '@/scenes/messages/AnnouncementDetailScene';
import { MessagesCategoryScene } from '@/scenes/messages/MessagesCategoryScene';
import { MessagesHubScene } from '@/scenes/messages/MessagesHubScene';
import { PersonalCenterScene } from '@/scenes/profile/PersonalCenterScene';
import { AccountEmailScene } from '@/scenes/profile/AccountEmailScene';
import { GoogleAuthenticatorScene } from '@/scenes/profile/GoogleAuthenticatorScene';
import { SetTransactionPasswordScene } from '@/scenes/profile/SetTransactionPasswordScene';
import { LoginDevicesScene } from '@/scenes/profile/LoginDevicesScene';
import { MpcNetworkSettingsScene } from '@/scenes/profile/MpcNetworkSettingsScene';
import { AboutScene } from '@/scenes/profile/AboutScene';
import { IdentityVerificationScene } from '@/scenes/profile/IdentityVerificationScene';
import { ResetAccountEmailScene } from '@/scenes/profile/ResetAccountEmailScene';
import { ProfileEditScene } from '@/scenes/profile/ProfileEditScene';
import { ScanScene } from '@/scenes/scan/ScanScene';
import { TeamCenterDetailScene } from '@/scenes/team/TeamCenterDetailScene';
import { TeamCenterScene } from '@/scenes/team/TeamCenterScene';
import { usePersonalCenterScreenOptions } from '@/scenes/profile/usePersonalCenterScreenOptions';
import {
  useAccountEmailScreenOptions,
  useResetAccountEmailScreenOptions,
} from '@/scenes/profile/useAccountEmailScreenOptions';
import { useGoogleAuthenticatorScreenOptions } from '@/scenes/profile/useGoogleAuthenticatorScreenOptions';
import { useSetTransactionPasswordScreenOptions } from '@/scenes/profile/useSetTransactionPasswordScreenOptions';
import { useLoginDevicesScreenOptions } from '@/scenes/profile/useLoginDevicesScreenOptions';
import { useMpcNetworkSettingsScreenOptions } from '@/scenes/profile/useMpcNetworkSettingsScreenOptions';
import { useAboutScreenOptions } from '@/scenes/profile/useAboutScreenOptions';
import { useIdentityVerificationScreenOptions } from '@/scenes/profile/useIdentityVerificationScreenOptions';
import { useProfileEditScreenOptions } from '@/scenes/profile/useProfileEditScreenOptions';
import { useTeamCenterScreenOptions } from '@/scenes/team/useTeamCenterScreenOptions';
import { useTeamCenterDetailScreenOptions } from '@/scenes/team/useTeamCenterDetailScreenOptions';
import { useAnnouncementDetailScreenOptions } from '@/scenes/messages/useAnnouncementDetailScreenOptions';
import { useMessagesCategoryScreenOptions } from '@/scenes/messages/useMessagesCategoryScreenOptions';
import { useMessagesScreenOptions } from '@/scenes/messages/useMessagesScreenOptions';
import { useScanScreenOptions } from '@/scenes/scan/useScanScreenOptions';
import { edsPageStackNavigatorExtraProps } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { useCregisStackScreenOptions } from '@/navigation/screenOptions/useCregisStackScreenOptions';
import type { HomeStackParamList } from '@/navigation/types';

const Stack = createCregisPageStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  const assetDistributionOptions = useAssetDistributionScreenOptions();
  const personalCenterOptions = usePersonalCenterScreenOptions();
  const profileEditOptions = useProfileEditScreenOptions();
  const identityVerificationOptions = useIdentityVerificationScreenOptions();
  const accountEmailOptions = useAccountEmailScreenOptions();
  const resetAccountEmailOptions = useResetAccountEmailScreenOptions();
  const googleAuthenticatorOptions = useGoogleAuthenticatorScreenOptions();
  const setTransactionPasswordOptions = useSetTransactionPasswordScreenOptions();
  const loginDevicesOptions = useLoginDevicesScreenOptions();
  const mpcNetworkSettingsOptions = useMpcNetworkSettingsScreenOptions();
  const aboutOptions = useAboutScreenOptions();
  const teamCenterOptions = useTeamCenterScreenOptions();
  const teamCenterDetailOptions = useTeamCenterDetailScreenOptions();
  const messagesOptions = useMessagesScreenOptions();
  const scanOptions = useScanScreenOptions();
  const messagesCategoryOptions = useMessagesCategoryScreenOptions();
  const announcementDetailOptions = useAnnouncementDetailScreenOptions();
  const screenOptions = useCregisStackScreenOptions();

  return (
    <Stack.Navigator
      {...edsPageStackNavigatorExtraProps()}
      screenOptions={screenOptions}
    >
      <Stack.Screen name="HomeMain" component={HomeMainScreen} />
      <Stack.Screen
        name="AssetDistribution"
        component={AssetDistributionScene}
        options={(props) => ({
          ...screenOptions(props),
          ...assetDistributionOptions,
        })}
      />
      <Stack.Screen
        name="PersonalCenter"
        component={PersonalCenterScene}
        options={(props) => ({
          ...screenOptions(props),
          ...personalCenterOptions,
        })}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScene}
        options={(props) => ({
          ...screenOptions(props),
          ...profileEditOptions,
        })}
      />
      <Stack.Screen
        name="IdentityVerification"
        component={IdentityVerificationScene}
        options={(props) => ({
          ...screenOptions(props),
          ...identityVerificationOptions,
        })}
      />
      <Stack.Screen
        name="AccountEmail"
        component={AccountEmailScene}
        options={(props) => ({
          ...screenOptions(props),
          ...accountEmailOptions,
        })}
      />
      <Stack.Screen
        name="ResetAccountEmail"
        component={ResetAccountEmailScene}
        options={(props) => ({
          ...screenOptions(props),
          ...resetAccountEmailOptions,
        })}
      />
      <Stack.Screen
        name="GoogleAuthenticator"
        component={GoogleAuthenticatorScene}
        options={(props) => ({
          ...screenOptions(props),
          ...googleAuthenticatorOptions,
        })}
      />
      <Stack.Screen
        name="SetTransactionPassword"
        component={SetTransactionPasswordScene}
        options={(props) => ({
          ...screenOptions(props),
          ...setTransactionPasswordOptions,
        })}
      />
      <Stack.Screen
        name="LoginDevices"
        component={LoginDevicesScene}
        options={(props) => ({
          ...screenOptions(props),
          ...loginDevicesOptions,
        })}
      />
      <Stack.Screen
        name="MpcNetworkSettings"
        component={MpcNetworkSettingsScene}
        options={(props) => ({
          ...screenOptions(props),
          ...mpcNetworkSettingsOptions,
        })}
      />
      <Stack.Screen
        name="About"
        component={AboutScene}
        options={(props) => ({
          ...screenOptions(props),
          ...aboutOptions,
        })}
      />
      <Stack.Screen
        name="TeamCenter"
        component={TeamCenterScene}
        options={(props) => ({
          ...screenOptions(props),
          ...teamCenterOptions(props),
        })}
      />
      <Stack.Screen
        name="TeamCenterDetail"
        component={TeamCenterDetailScene}
        options={(props) => ({
          ...screenOptions(props),
          ...teamCenterDetailOptions(props),
        })}
      />
      <Stack.Screen
        name="Messages"
        component={MessagesHubScene}
        options={(props) => ({
          ...screenOptions(props),
          ...messagesOptions(props),
        })}
      />
      <Stack.Screen
        name="MessagesCategory"
        component={MessagesCategoryScene}
        options={(props) => ({
          ...screenOptions(props),
          ...messagesCategoryOptions(props),
        })}
      />
      <Stack.Screen
        name="MessagesAnnouncement"
        component={AnnouncementDetailScene}
        options={(props) => ({
          ...screenOptions(props),
          ...announcementDetailOptions(props),
        })}
      />
      <Stack.Screen
        name="Scan"
        component={ScanScene}
        options={(props) => ({
          ...screenOptions(props),
          ...scanOptions,
        })}
      />
    </Stack.Navigator>
  );
}