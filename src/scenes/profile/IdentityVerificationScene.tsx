import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';

import { EgDecorButton } from '@/eds/scene-buttons';
import { EgSheets } from '@/eds/sheets';
import { EgInput } from '@/eds/input';
import { EgLink } from '@/eds/link-button';
import { EgSymbol } from '@/eds/profile-icons';
import { EgCheckbox } from '@/eds/toggle';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { useAccountEmail } from '@/scenes/shared/homeUserIdentity';
import { edsPageCardBackground, edsPx, edsSceneContentInset } from '@/utils/edsTheme';

const PHONE_MAX_LENGTH = 11;
const IDENTITY_HELP_DOC_URL =
  'https://support.cregis.com/cregis-wallet-guide/zh-cn/transaction-riskcontrol/kyb-kyc';

/** EgInput 会把 leading / trailing 传给字段壳。公开类型尚未声明这两项。 */
function fieldIcons(leading: ReactNode, trailing?: ReactNode) {
  return { leading, trailing } as object;
}

/** 实名认证 · 邮箱锁定、手机号、协议与提交说明。 */
export function IdentityVerificationScene() {
  const { t } = useTranslation();
  const accountEmail = useAccountEmail();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { mode, spacing, colors } = useEdsTheme();
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [sentVisible, setSentVisible] = useState(false);
  const [exitVisible, setExitVisible] = useState(false);
  const phoneRef = useRef(phone);
  const allowLeaveRef = useRef(false);
  phoneRef.current = phone;
  const [footerHeight, setFooterHeight] = useState(0);
  const fieldGap = edsPx(spacing['spacing-2']);
  const blockGap = edsPx(spacing['spacing-5']);

  const emailIcon = (
    <EgSymbol
      name="eds-email"
      mode={mode}
      size="md"
      strokeColorToken="text-base-secondary"
      accessibilityLabel=""
    />
  );

  const confirm = () => {
    if (phone.length === 0 || !agreed) {
      return;
    }
    setSentVisible(true);
  };

  const dismissSent = () => {
    setSentVisible(false);
    navigation.goBack();
  };

  const openHelpDoc = () => {
    void WebBrowser.openBrowserAsync(IDENTITY_HELP_DOC_URL).catch(() => undefined);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (allowLeaveRef.current || phoneRef.current.length > 0) {
        return;
      }
      event.preventDefault();
      setExitVisible(true);
    });
    return unsubscribe;
  }, [navigation]);

  const confirmExit = () => {
    allowLeaveRef.current = true;
    setExitVisible(false);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
    <SceneScaffold title={t('profile.identityVerification')} showNavBack pageBackground="card">
      <View style={{ gap: blockGap }}>
          <View style={{ gap: fieldGap }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-1']) }}>
              <SceneText variant="bodyMediumStrong">{t('profile.identityEmail')}</SceneText>
              <SceneText variant="bodyMediumStrong" style={{ color: String(colors['status-danger']) }}>
                *
              </SceneText>
            </View>
            <EgInput
              mode={mode}
              size="xl"
              value={accountEmail}
              disabled
              showClear={false}
              {...fieldIcons(emailIcon)}
            />
          </View>

          <View style={{ gap: fieldGap }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-1']) }}>
              <SceneText variant="bodyMediumStrong">{t('profile.identityPhone')}</SceneText>
              <SceneText variant="bodyMediumStrong" style={{ color: String(colors['status-danger']) }}>
                *
              </SceneText>
            </View>
            <EgInput
              mode={mode}
              size="xl"
              value={phone}
              placeholder={t('profile.identityPhonePlaceholder')}
              showClear={false}
              onChangeText={(text) => setPhone(text.replace(/\D/g, '').slice(0, PHONE_MAX_LENGTH))}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: edsPx(spacing['spacing-2']),
            }}
          >
            <EgCheckbox
              mode={mode}
              size="md"
              checked={agreed}
              onCheckedChange={setAgreed}
              accessibilityLabel={t('profile.identityAgreePrefix')}
            />
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
              <SceneText variant="body">{t('profile.identityAgreePrefix')}</SceneText>
              <EgLink
                mode={mode}
                size="md"
                tone="brand"
                label={t('profile.identityPrivacyAgreement')}
                onPress={() => undefined}
              />
            </View>
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
            gap: edsPx(spacing['spacing-5']),
            paddingHorizontal: edsSceneContentInset(spacing),
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
            <View style={{ flex: 1, gap: edsPx(spacing['spacing-1']) }}>
              <SceneText variant="bodySmall">{t('profile.identitySubmitNotice')}</SceneText>
              <Pressable
                onPress={openHelpDoc}
                accessibilityRole="link"
                accessibilityLabel={t('profile.identityHelpDoc')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-1']) }}
              >
                <EgLink
                  mode={mode}
                  size="sm"
                  tone="brand"
                  label={t('profile.identityHelpDoc')}
                  onPress={openHelpDoc}
                />
                <EgSymbol
                  name="eds-link"
                  mode={mode}
                  size="sm"
                  strokeColorToken="text-brand"
                  accessibilityLabel=""
                />
              </Pressable>
            </View>
          </View>
          <EgDecorButton
            mode={mode}
            size="lg"
            figmaType="primary"
            label={t('profile.identityConfirm')}
            disabled={phone.length === 0}
            onPress={confirm}
            style={{ alignSelf: 'stretch' }}
            testID="identity-verification-confirm"
          />
        </View>
      <EgSheets
        visible={sentVisible}
        onDismiss={dismissSent}
        mode={mode}
        detents={['adaptive']}
        initialDetent="adaptive"
        showTitle={false}
        showLeft={false}
        showRight={false}
        dismissible
        testID="identity-verification-sent-sheet"
        actions={
          <EgDecorButton
            label={t('profile.identitySentConfirm')}
            mode={mode}
            size="lg"
            figmaType="primary"
            onPress={() => setSentVisible(false)}
            style={{ alignSelf: 'stretch' }}
            testID="identity-verification-sent-confirm"
          />
        }
      >
        <View style={{ gap: edsPx(spacing['spacing-3']), alignItems: 'center' }}>
          <SceneText variant="title" style={{ textAlign: 'center' }}>
            {t('profile.identitySentTitle')}
          </SceneText>
          <SceneText variant="body" style={{ textAlign: 'center', color: String(colors['text-base-secondary']) }}>
            {t('profile.identitySentBefore')}
            {`"${accountEmail}"`}
            {t('profile.identitySentAfter')}
          </SceneText>
        </View>
      </EgSheets>
      <EgSheets
        visible={exitVisible}
        onDismiss={() => setExitVisible(false)}
        mode={mode}
        detents={['adaptive']}
        initialDetent="adaptive"
        showTitle={false}
        showLeft={false}
        showRight={false}
        dismissible
        testID="identity-verification-exit-sheet"
        actions={
          <View style={{ gap: edsPx(spacing['spacing-4']), alignItems: 'stretch' }}>
            <EgDecorButton
              label={t('profile.identityExitConfirm')}
              mode={mode}
              size="lg"
              figmaType="primary"
              onPress={confirmExit}
              style={{ alignSelf: 'stretch' }}
              testID="identity-verification-exit-confirm"
            />
            <EgLink
              mode={mode}
              size="lg"
              tone="option"
              label={t('profile.identityExitCancel')}
              onPress={() => setExitVisible(false)}
              style={{ alignSelf: 'center' }}
            />
          </View>
        }
      >
        <View style={{ gap: edsPx(spacing['spacing-3']), alignItems: 'center' }}>
          <SceneText variant="title" style={{ textAlign: 'center' }}>
            {t('profile.identityExitTitle')}
          </SceneText>
          <SceneText variant="body" style={{ textAlign: 'center', color: String(colors['text-base-secondary']) }}>
            {t('profile.identityExitBody')}
          </SceneText>
        </View>
      </EgSheets>
    </View>
  );
}
