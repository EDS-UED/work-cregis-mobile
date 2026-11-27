import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { SceneText } from '@/scenes/shared/SceneText';
import { TeamAmlIllustration } from '@/scenes/team/detail/TeamAmlIllustration';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

/** 导航底 → 主标题「AML」· 稿面 300px。 */
const AML_HERO_TITLE_OFFSET_FROM_NAV_PX = 300;

/** AML 介绍 · 插画 + 文案（底栏见 {@link TeamAmlDetailActions}）。 */
export function TeamAmlDetailContent() {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();
  const copyInsetX = edsPx(spacing['spacing-8']);
  const titleToSubcopyGap = edsPx(spacing['spacing-3']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          alignSelf: 'stretch',
        },
        illustrationLayer: {
          ...StyleSheet.absoluteFill,
          alignItems: 'center',
          justifyContent: 'flex-start',
        },
        copy: {
          alignItems: 'center',
          alignSelf: 'stretch',
          paddingTop: AML_HERO_TITLE_OFFSET_FROM_NAV_PX,
          paddingHorizontal: copyInsetX,
        },
        subcopy: {
          alignItems: 'center',
          alignSelf: 'stretch',
          marginTop: titleToSubcopyGap,
        },
      }),
    [copyInsetX, titleToSubcopyGap],
  );

  return (
    <View style={styles.root}>
      <View style={styles.illustrationLayer} pointerEvents="none">
        <TeamAmlIllustration />
      </View>
      <View style={styles.copy}>
        <SceneText variant="display" style={{ textAlign: 'center' }}>
          {t('team.amlHeroTitle')}
        </SceneText>
        <View style={styles.subcopy}>
          <SceneText variant="bodyLarge" style={{ textAlign: 'center' }}>
            {t('team.amlHeroLine1')}
          </SceneText>
          <SceneText variant="bodyLarge" style={{ textAlign: 'center' }}>
            {t('team.amlHeroLine2')}
          </SceneText>
        </View>
      </View>
    </View>
  );
}