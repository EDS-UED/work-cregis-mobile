import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { useTranslation } from 'react-i18next';

import { EgInput } from '@/eds/input';
import { EgLink } from '@/eds/link-button';
import { EgSymbol } from '@/eds/profile-icons';
import { EgDecorButton } from '@/eds/scene-buttons';
import { egNavBarScrollContentReserve } from '@/eds/nav-bar';
import { EgSheets } from '@/eds/sheets';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { useAccountEmail } from '@/scenes/shared/homeUserIdentity';
import { edsPageCardBackground, edsPx, edsSceneContentInset } from '@/utils/edsTheme';

/** 演示用绑定密钥，与二维码内容一致。 */
const GOOGLE_AUTH_SECRET = 'VFDEQQB43QYV7HGU2ZQFPYQGKBDL6TRW';

const MASK = '•';

function authenticatorUri(email: string): string {
  return `otpauth://totp/Cregis:${encodeURIComponent(email)}?secret=${GOOGLE_AUTH_SECRET}&issuer=Cregis`;
}

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

/** 绑定 Google 验证器 · 二维码、密钥与复制。 */
export function GoogleAuthenticatorScene() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { mode, spacing, colors } = useEdsTheme();
  const email = useAccountEmail();
  const [footerHeight, setFooterHeight] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordRevealed, setPasswordRevealed] = useState(false);
  const qrSize = edsPx(spacing['spacing-20']) * 2 + edsPx(spacing['spacing-8']);
  const corner = edsPx(spacing['spacing-6']);
  const stroke = edsPx(spacing['stroke-xl']);
  const frameColor = String(colors['text-base-primary']);

  const copySecret = () => {
    void Clipboard.setStringAsync(GOOGLE_AUTH_SECRET, {
      android: { isSensitive: true },
    }).catch(() => undefined);
  };

  return (
    <View style={{ flex: 1 }}>
      <SceneScaffold title={t('profile.googleAuthBindTitle')} showNavBack pageBackground="card">
        <View style={{ alignItems: 'center', gap: edsPx(spacing['spacing-5']) }}>
          <View
            style={{
              padding: edsPx(spacing['spacing-5']),
            }}
          >
            <QRCode
              value={authenticatorUri(email)}
              size={qrSize}
              color={frameColor}
              backgroundColor={edsPageCardBackground(colors)}
            />
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: corner,
                height: corner,
                borderTopWidth: stroke,
                borderLeftWidth: stroke,
                borderColor: frameColor,
              }}
            />
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: corner,
                height: corner,
                borderTopWidth: stroke,
                borderRightWidth: stroke,
                borderColor: frameColor,
              }}
            />
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: corner,
                height: corner,
                borderBottomWidth: stroke,
                borderLeftWidth: stroke,
                borderColor: frameColor,
              }}
            />
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: corner,
                height: corner,
                borderBottomWidth: stroke,
                borderRightWidth: stroke,
                borderColor: frameColor,
              }}
            />
          </View>
          <SceneText variant="bodyMediumStrong" style={{ textAlign: 'center' }}>
            {GOOGLE_AUTH_SECRET}
          </SceneText>
          <EgLink
            mode={mode}
            size="md"
            tone="brand"
            label={t('profile.googleAuthCopy')}
            onPress={copySecret}
            style={{ alignSelf: 'center' }}
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
          gap: edsPx(spacing['spacing-5']),
          paddingHorizontal: edsSceneContentInset(spacing),
          paddingBottom: insets.bottom + edsPx(spacing['spacing-4']),
          backgroundColor: edsPageCardBackground(colors),
        }}
      >
        <SceneText variant="bodySmallSecondary" style={{ textAlign: 'center' }}>
          {t('profile.googleAuthHint')}
        </SceneText>
        <EgDecorButton
          mode={mode}
          size="lg"
          figmaType="primary"
          label={t('profile.googleAuthVerify')}
          onPress={() => setPasswordVisible(true)}
          style={{ alignSelf: 'stretch' }}
          testID="google-authenticator-verify"
        />
      </View>
      <EgSheets
        visible={passwordVisible}
        onDismiss={() => setPasswordVisible(false)}
        mode={mode}
        detents={['medium']}
        initialDetent="medium"
        showTitle={false}
        showLeft={false}
        showRight
        dismissible
        testID="google-auth-password-sheet"
        actions={
          <EgDecorButton
            label={t('profile.googleAuthPasswordConfirm')}
            mode={mode}
            size="lg"
            figmaType="primary"
            disabled={password.length === 0}
            onPress={() => {
              setPasswordVisible(false);
              navigation.goBack();
            }}
            style={{ alignSelf: 'stretch' }}
            testID="google-auth-password-confirm"
          />
        }
      >
        <View
          style={{
            alignItems: 'center',
            alignSelf: 'stretch',
            gap: edsPx(spacing['spacing-4']),
            marginTop:
              edsPx(spacing['spacing-9']) -
              egNavBarScrollContentReserve(
                0,
                edsPx(spacing['spacing-4']),
                edsPx(spacing['spacing-2']),
              ),
          }}
        >
          <SceneText variant="title" style={{ textAlign: 'center' }}>
            {t('profile.googleAuthPasswordTitle')}
          </SceneText>
          <SceneText
            variant="body"
            style={{ textAlign: 'center', color: String(colors['text-base-secondary']) }}
          >
            {t('profile.googleAuthPasswordHint')}
          </SceneText>
          <View style={{ alignSelf: 'stretch' }}>
          <EgInput
            mode={mode}
            size="xl"
            value={passwordRevealed ? password : MASK.repeat(password.length)}
            placeholder={t('profile.googleAuthPasswordPlaceholder')}
            showClear={false}
            onChangeText={(text) =>
              setPassword(passwordRevealed ? text : applyMaskedEdit(password, text))
            }
            {...fieldTrailing(
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('profile.googleAuthPasswordPlaceholder')}
                onPress={() => setPasswordRevealed((current) => !current)}
                hitSlop={edsPx(spacing['spacing-2'])}
              >
                <EgSymbol
                  name={passwordRevealed ? 'eds-eye' : 'eds-close-eye'}
                  mode={mode}
                  size="md"
                  strokeColorToken="text-base-tertiary"
                  accessibilityLabel=""
                />
              </Pressable>,
            )}
          />
          </View>
        </View>
      </EgSheets>
    </View>
  );
}
