import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgSymbol } from '@/eds/home-ui';
import { EgDecorButton } from '@/eds/scene-buttons';
import { egNavBarScrollContentReserve } from '@/eds/nav-bar';
import { EgSheets } from '@/eds/sheets';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type SystemMessageSheetProps = {
  onReturnHome: () => void;
};

function MessageSection({ title, children }: { title: string; children: string }) {
  const { spacing } = useEdsTheme();

  return (
    <View style={{ gap: edsPx(spacing['spacing-1']) }}>
      <SceneText variant="bodyMediumStrong">{title}</SceneText>
      <SceneText variant="body">{children}</SceneText>
    </View>
  );
}

/** 每次打开 App 的系统消息 · EgSheets large · Got It 回首页。 */
export function SystemMessageSheet({ onReturnHome }: SystemMessageSheetProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const [visible, setVisible] = useState(true);
  const returnHomeOnDismiss = useRef(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (next) => {
      if (appState.current === 'background' && next === 'active') {
        setVisible(true);
      }
      appState.current = next;
    });
    return () => subscription.remove();
  }, []);

  const logoLift = egNavBarScrollContentReserve(
    0,
    edsPx(spacing['spacing-4']),
    edsPx(spacing['spacing-2']),
  ) + edsPx(spacing['spacing-1']) - edsPx(spacing['spacing-5']);

  const onGotIt = useCallback(() => {
    returnHomeOnDismiss.current = true;
    setVisible(false);
  }, []);

  const onDismiss = useCallback(() => {
    if (!returnHomeOnDismiss.current) {
      return;
    }
    returnHomeOnDismiss.current = false;
    onReturnHome();
  }, [onReturnHome]);

  return (
    <EgSheets
      visible={visible}
      onDismiss={onDismiss}
      mode={mode}
      showTitle={false}
      showLeft={false}
      showRight={false}
      dismissible={false}
      showDragIndicator
      scrollEdgeEffect="hidden"
      detents={['large']}
      initialDetent="large"
      testID="system-message-sheet"
      actions={
        <EgDecorButton
          label={t('systemMessage.gotIt')}
          mode={mode}
          size="lg"
          figmaType="primary"
          onPress={onGotIt}
          style={{ alignSelf: 'stretch' }}
          testID="system-message-got-it"
        />
      }
    >
      <View
        style={{
          marginTop: -logoLift,
          gap: edsPx(spacing['spacing-5']),
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <EgSymbol
            name="eds-warning"
            displayPx={edsPx(spacing['avatar-5xl'])}
            strokeColorToken="text-base-primary"
            accessibilityLabel={t('systemMessage.logoLabel')}
          />
        </View>
        <SceneText variant="title" style={{ textAlign: 'center' }}>
          {t('systemMessage.title')}
        </SceneText>
        <View style={{ gap: edsPx(spacing['spacing-4']) }}>
          <SceneText variant="body">{t('systemMessage.greeting')}</SceneText>
          <SceneText variant="body">{t('systemMessage.intro')}</SceneText>
          <MessageSection title={t('systemMessage.periodTitle')}>
            {t('systemMessage.periodBody')}
          </MessageSection>
          <MessageSection title={t('systemMessage.participateTitle')}>
            {t('systemMessage.participateBody')}
          </MessageSection>
          <View style={{ gap: edsPx(spacing['spacing-3']) }}>
            <SceneText variant="bodyMediumStrong">{t('systemMessage.rulesTitle')}</SceneText>
            <SceneText variant="body">{t('systemMessage.rulesIntro')}</SceneText>
            <SceneText variant="body">{t('systemMessage.rulesTier1')}</SceneText>
            <SceneText variant="body">{t('systemMessage.rulesTier2')}</SceneText>
            <SceneText variant="body">{t('systemMessage.rulesSettlement')}</SceneText>
          </View>
          <SceneText variant="body">{t('systemMessage.closing')}</SceneText>
          <View style={{ gap: edsPx(spacing['spacing-1']) }}>
            <SceneText variant="bodyMediumStrong">{t('systemMessage.signature')}</SceneText>
            <SceneText variant="bodySmallSecondary">{t('systemMessage.date')}</SceneText>
          </View>
        </View>
      </View>
    </EgSheets>
  );
}
