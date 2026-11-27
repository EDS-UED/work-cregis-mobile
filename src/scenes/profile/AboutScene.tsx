import { useState } from 'react';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';

import { EgItem } from '@/eds/item';
import { EgLink } from '@/eds/link-button';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { PersonalCenterSettingsGroup } from '@/scenes/profile/PersonalCenterSettingsGroup';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPageCardBackground, edsPx, edsSceneContentInset } from '@/utils/edsTheme';

import cregisMark from '../../../assets/cregis-mark.png';

const ABOUT_VERSION = 'Version 3.9.0';
const OFFICIAL_SITE_URL = 'https://www.cregis.com/';
const TERMS_URL =
  'https://support.cregis.com/cregis-wallet-guide/zh-cn/resources/tiao-kuan-yu-xi-ze/cregis-standard-terms-of-service';
const PRIVACY_URL =
  'https://support.cregis.com/cregis-wallet-guide/zh-cn/resources/tiao-kuan-yu-xi-ze/personal_information_collection_statement';
const SUPPORT_EMAIL = 'support@cregis.com';

function openInApp(url: string) {
  void WebBrowser.openBrowserAsync(url).catch(() => undefined);
}

/** 关于 · 版本与协议。官网、条款、隐私在应用内打开。 */
export function AboutScene() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { mode, spacing, colors } = useEdsTheme();
  const [footerHeight, setFooterHeight] = useState(0);
  const markSize = edsPx(spacing['spacing-16']);
  const rowInset = edsSceneContentInset(spacing);

  return (
    <View style={{ flex: 1 }}>
      <SceneScaffold title={t('profile.about')} showNavBack showNavTitle={false} pageBackground="card">
        <View
          style={{
            alignItems: 'center',
            gap: edsPx(spacing['spacing-2']),
            marginTop: edsPx(spacing['spacing-8']),
          }}
        >
          <Image
            source={cregisMark}
            accessibilityLabel="Cregis"
            style={{
              width: markSize,
              height: markSize,
              borderRadius: edsPx(spacing['radius-sm']),
            }}
          />
          <SceneText variant="title">Cregis</SceneText>
          <SceneText variant="bodySmallSecondary">{ABOUT_VERSION}</SceneText>
        </View>

        <PersonalCenterSettingsGroup marginBottom={0}>
          <EgItem
            testID="about-row-version"
            mode={mode}
            label={t('profile.aboutVersionUpdate')}
            showChevron
            showDivider
            accessibilityLabel={t('profile.aboutVersionUpdate')}
          />
          <EgItem
            testID="about-row-site"
            mode={mode}
            label={t('profile.aboutOfficialSite')}
            showChevron
            showDivider={false}
            onPress={() => openInApp(OFFICIAL_SITE_URL)}
            accessibilityLabel={t('profile.aboutOfficialSite')}
          />
        </PersonalCenterSettingsGroup>
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
          alignItems: 'center',
          gap: edsPx(spacing['spacing-2']),
          paddingHorizontal: rowInset,
          paddingBottom: insets.bottom + edsPx(spacing['spacing-4']),
          backgroundColor: edsPageCardBackground(colors),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: edsPx(spacing['spacing-3']),
          }}
        >
          <EgLink
            mode={mode}
            size="md"
            tone="brand"
            label={t('profile.aboutTerms')}
            onPress={() => openInApp(TERMS_URL)}
          />
          <View
            style={{
              width: edsPx(spacing['stroke-md']),
              height: edsPx(spacing['spacing-4']),
              backgroundColor: String(colors['stroke-divider']),
            }}
          />
          <EgLink
            mode={mode}
            size="md"
            tone="brand"
            label={t('profile.aboutPrivacy')}
            onPress={() => openInApp(PRIVACY_URL)}
          />
        </View>
        <SceneText variant="bodySmallSecondary">
          {t('profile.aboutSupport')}
          {SUPPORT_EMAIL}
        </SceneText>
        <SceneText variant="bodySmallTertiary">{t('profile.aboutCopyright')}</SceneText>
      </View>
    </View>
  );
}
