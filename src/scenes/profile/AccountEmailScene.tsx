import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgSymbol } from '@/eds/profile-icons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useHomeStackNavigation } from '@/scenes/home/useHomeStackNavigation';
import { PersonalCenterSettingsGroup } from '@/scenes/profile/PersonalCenterSettingsGroup';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { useAccountEmail } from '@/scenes/shared/homeUserIdentity';
import { maskEmail } from '@/utils/maskEmail';
import { edsPx } from '@/utils/edsTheme';

/** 电子邮箱 · 展示脱敏地址，编辑进入重置页。 */
export function AccountEmailScene() {
  const { t } = useTranslation();
  const navigation = useHomeStackNavigation();
  const { mode, spacing } = useEdsTheme();
  const email = useAccountEmail();

  return (
    <SceneScaffold title={t('profile.email')} showNavBack pageBackground="card">
      <PersonalCenterSettingsGroup marginBottom={0}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: edsPx(spacing['spacing-3']),
          paddingHorizontal: edsPx(spacing['spacing-4']),
          paddingVertical: edsPx(spacing['spacing-4']),
        }}
      >
        <EgSymbol
          name="eds-email-fill"
          mode={mode}
          size="lg"
          fillTone="brand"
          accessibilityLabel=""
        />
        <View style={{ flex: 1, gap: edsPx(spacing['spacing-1']) }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: edsPx(spacing['spacing-2']),
            }}
          >
            <SceneText variant="bodyMediumStrong" style={{ flex: 1 }} numberOfLines={1}>
              {maskEmail(email)}
            </SceneText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('team.edit')}
              onPress={() => navigation.navigate('ResetAccountEmail')}
              hitSlop={edsPx(spacing['spacing-2'])}
              testID="account-email-edit"
            >
              <EgSymbol
                name="eds-editor"
                mode={mode}
                size="md"
                strokeColorToken="text-base-tertiary"
                accessibilityLabel=""
              />
            </Pressable>
          </View>
          <SceneText variant="bodySmallSecondary">{t('profile.accountEmailUsage')}</SceneText>
        </View>
      </View>
      </PersonalCenterSettingsGroup>
    </SceneScaffold>
  );
}
