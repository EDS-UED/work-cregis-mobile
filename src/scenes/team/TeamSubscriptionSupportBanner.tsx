import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgDecorButton } from '@/eds/scene-buttons';
import { TeamCenterMenuLeadIcon } from '@/scenes/team/TeamCenterMenuLeadIcon';
import { SceneText } from '@/scenes/shared/SceneText';
import { teamSubscriptionSectionDividerInsetBottom } from '@/scenes/team/teamSubscriptionItemLayout';
import { edsPx } from '@/utils/edsTheme';

/** 订阅稿 · 专属客户经理条。 */
export function TeamSubscriptionSupportBanner() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          marginTop: teamSubscriptionSectionDividerInsetBottom(spacing),
        },
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-3']),
          backgroundColor: String(colors['material-card-same-white']),
          borderRadius: edsPx(spacing['radius-lg']),
          paddingVertical: edsPx(spacing['spacing-4']),
          paddingHorizontal: edsPx(spacing['spacing-3']),
        },
        copy: {
          flex: 1,
          minWidth: 0,
          gap: edsPx(spacing['spacing-05']),
        },
      }),
    [colors, spacing],
  );

  return (
    <View style={styles.root}>
      <View style={styles.card}>
      <TeamCenterMenuLeadIcon icon="eds-team" />
      <View style={styles.copy}>
        <SceneText variant="bodySemibold">{t('team.subscriptionSupportTitle')}</SceneText>
        <SceneText variant="bodySmallSecondary">{t('team.subscriptionSupportSubtitle')}</SceneText>
      </View>
      <EgDecorButton
        label={t('team.subscriptionContact')}
        mode={mode}
        size="sm"
        onPress={() => undefined}
        accessibilityLabel={t('team.subscriptionContact')}
      />
      </View>
    </View>
  );
}