import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { EgInput } from '@/eds/input';
import { EgDecorButton } from '@/eds/scene-buttons';
import { EgSymbol } from '@/eds/profile-icons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { useHomeStore } from '@/store';
import { edsPageCardBackground, edsPx, edsSceneContentInset } from '@/utils/edsTheme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 重置电子邮箱 · 未填合法地址时提交不可用。 */
export function ResetAccountEmailScene() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { mode, spacing, colors } = useEdsTheme();
  const setAccountEmail = useHomeStore((state) => state.setAccountEmail);
  const [email, setEmail] = useState('');
  const [footerHeight, setFooterHeight] = useState(0);
  const canSubmit = EMAIL_PATTERN.test(email.trim());
  const fieldGap = edsPx(spacing['spacing-2']);

  const submit = () => {
    if (!canSubmit) {
      return;
    }
    setAccountEmail(email.trim());
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <SceneScaffold title={t('profile.accountEmailResetTitle')} showNavBack pageBackground="card">
        <View style={{ gap: fieldGap }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-1']) }}>
            <SceneText variant="bodyMediumStrong">{t('profile.accountEmailNewPlaceholder')}</SceneText>
            <SceneText variant="bodyMediumStrong" style={{ color: String(colors['status-danger']) }}>
              *
            </SceneText>
          </View>
          <EgInput
            mode={mode}
            size="xl"
            value={email}
            placeholder={t('profile.accountEmailInputPlaceholder')}
            showClear={false}
            onChangeText={setEmail}
            testID="reset-account-email-input"
          />
        </View>
        <View style={{ height: footerHeight }} />
      </SceneScaffold>
      <View
        onLayout={(event) => {
          const next = Math.round(event.nativeEvent.layout.height);
          setFooterHeight((current) => (current === next ? current : next));
        }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: edsSceneContentInset(spacing),
          gap: edsPx(spacing['spacing-5']),
          paddingBottom: insets.bottom + edsPx(spacing['spacing-4']),
          backgroundColor: edsPageCardBackground(colors),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: edsPx(spacing['spacing-3']),
            padding: edsPx(spacing['spacing-4']),
            borderRadius: edsPx(spacing['radius-lg']),
            borderWidth: edsPx(spacing['stroke-md']),
            borderColor: String(colors['status-success']),
            backgroundColor: String(colors['status-success-weaken']),
          }}
        >
          <EgSymbol name="eds-information-fill" mode={mode} size="md" accessibilityLabel="" />
          <View style={{ flex: 1 }}>
            <SceneText variant="bodySmall">{t('profile.accountEmailResetHint')}</SceneText>
          </View>
        </View>
        <EgDecorButton
          mode={mode}
          size="lg"
          figmaType="primary"
          label={t('profile.accountEmailSubmit')}
          disabled={!canSubmit}
          onPress={submit}
          style={{ alignSelf: 'stretch' }}
          testID="reset-account-email-submit"
        />
      </View>
    </View>
  );
}
