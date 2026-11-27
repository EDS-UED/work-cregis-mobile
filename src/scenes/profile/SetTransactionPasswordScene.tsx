import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { EgInput } from '@/eds/input';
import { EgSymbol } from '@/eds/profile-icons';
import { EgDecorButton } from '@/eds/scene-buttons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { useHomeStore } from '@/store';
import { edsPageCardBackground, edsPx, edsSceneContentInset } from '@/utils/edsTheme';

const MASK = '•';
const LENGTH_PATTERN = /^[A-Za-z0-9]{8,16}$/;
const UPPER_PATTERN = /[A-Z]/;

/** EgInput 会把 trailing 传给字段壳。公开类型尚未声明该项。 */
function fieldTrailing(trailing: ReactNode) {
  return { trailing } as object;
}

function applyMaskedEdit(password: string, next: string): string {
  const masked = MASK.repeat(password.length);
  if (next.startsWith(masked)) {
    return password + next.slice(masked.length);
  }
  if (next === masked.slice(0, next.length)) {
    return password.slice(0, next.length);
  }
  return password;
}

/** 设置交易密码 · 未输入为灰勾，不符为红叉，符合为绿勾；两次一致后才可提交。 */
export function SetTransactionPasswordScene() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { mode, spacing, colors } = useEdsTheme();
  const setTransactionPasswordSet = useHomeStore((state) => state.setTransactionPasswordSet);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordRevealed, setPasswordRevealed] = useState(false);
  const [confirmRevealed, setConfirmRevealed] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const fieldGap = edsPx(spacing['spacing-2']);
  const blockGap = edsPx(spacing['spacing-5']);

  const lengthOk = LENGTH_PATTERN.test(password);
  const upperOk = UPPER_PATTERN.test(password);
  const confirmMismatch =
    confirmPassword.length > 0 &&
    (confirmPassword.length > password.length || !password.startsWith(confirmPassword));
  const canSubmit = lengthOk && upperOk && confirmPassword.length > 0 && confirmPassword === password;

  const submit = () => {
    if (!canSubmit) {
      return;
    }
    setTransactionPasswordSet(true);
    navigation.goBack();
  };

  const eye = (revealed: boolean, onPress: () => void) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('profile.transactionPassword')}
      onPress={onPress}
      hitSlop={edsPx(spacing['spacing-2'])}
    >
      <EgSymbol
        name={revealed ? 'eds-eye' : 'eds-close-eye'}
        mode={mode}
        size="md"
        strokeColorToken="text-base-tertiary"
        accessibilityLabel=""
      />
    </Pressable>
  );

  const fieldLabel = (label: string) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-1']) }}>
      <SceneText variant="bodyMediumStrong">{label}</SceneText>
      <SceneText variant="bodyMediumStrong" style={{ color: String(colors['status-danger']) }}>
        *
      </SceneText>
    </View>
  );

  const rule = (met: boolean, label: string) => {
    const failed = password.length > 0 && !met;
    const tone = met ? 'status-success' : failed ? 'status-danger' : 'text-base-tertiary';
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-2']) }}>
        <EgSymbol
          name={failed ? 'eds-close' : 'eds-tick'}
          mode={mode}
          size="sm"
          strokeColorToken={tone}
          accessibilityLabel=""
        />
        <SceneText variant="bodySmall" style={{ color: String(colors[tone]) }}>
          {label}
        </SceneText>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SceneScaffold title={t('profile.transactionPasswordSetTitle')} showNavBack pageBackground="card">
        <View style={{ gap: blockGap }}>
          <View style={{ gap: fieldGap }}>
            {fieldLabel(t('profile.transactionPasswordNew'))}
            <EgInput
              mode={mode}
              size="xl"
              value={passwordRevealed ? password : MASK.repeat(password.length)}
              placeholder={t('profile.transactionPasswordPlaceholder')}
              showClear={false}
              onChangeText={(text) => setPassword(passwordRevealed ? text : applyMaskedEdit(password, text))}
              {...fieldTrailing(eye(passwordRevealed, () => setPasswordRevealed((current) => !current)))}
            />
            <View style={{ gap: edsPx(spacing['spacing-2']) }}>
              {rule(lengthOk, t('profile.transactionPasswordRuleLength'))}
              {rule(upperOk, t('profile.transactionPasswordRuleUpper'))}
            </View>
          </View>
          <View style={{ gap: fieldGap }}>
            {fieldLabel(t('profile.transactionPasswordConfirm'))}
            <EgInput
              mode={mode}
              size="xl"
              value={confirmRevealed ? confirmPassword : MASK.repeat(confirmPassword.length)}
              placeholder={t('profile.transactionPasswordPlaceholder')}
              showClear={false}
              onChangeText={(text) =>
                setConfirmPassword(confirmRevealed ? text : applyMaskedEdit(confirmPassword, text))
              }
              {...fieldTrailing(eye(confirmRevealed, () => setConfirmRevealed((current) => !current)))}
            />
            {confirmMismatch ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-2']) }}>
                <EgSymbol
                  name="eds-close"
                  mode={mode}
                  size="sm"
                  strokeColorToken="status-danger"
                  accessibilityLabel=""
                />
                <SceneText variant="bodySmall" style={{ color: String(colors['status-danger']) }}>
                  {t('profile.transactionPasswordMismatch')}
                </SceneText>
              </View>
            ) : null}
          </View>
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
          paddingBottom: insets.bottom + edsPx(spacing['spacing-4']),
          backgroundColor: edsPageCardBackground(colors),
        }}
      >
        <EgDecorButton
          mode={mode}
          size="lg"
          figmaType="primary"
          label={t('profile.transactionPasswordSubmit')}
          disabled={password.length === 0 || confirmPassword.length === 0}
          onPress={submit}
          style={{ alignSelf: 'stretch' }}
          testID="set-transaction-password-submit"
        />
      </View>
    </View>
  );
}
