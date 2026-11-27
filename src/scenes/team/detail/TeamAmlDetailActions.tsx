import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EgDecorButton, EgOptionButton } from '@/eds/scene-buttons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { teamAmlActionsEdgeInset } from '@/scenes/team/detail/teamAmlActionsLayout';
import { edsPx } from '@/utils/edsTheme';

/** AML 屏底常驻 · 主「开始使用」+ 副「了解更多」。 */
export function TeamAmlDetailActions() {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const edgeX = teamAmlActionsEdgeInset(spacing);
  const restEdge = edsPx(spacing['spacing-5']);
  const idleBottom = Math.max(insets.bottom, restEdge);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        dock: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          alignSelf: 'stretch',
          paddingHorizontal: edgeX,
          paddingBottom: idleBottom,
          gap: edsPx(spacing['spacing-2']),
        },
        actionFullWidth: {
          alignSelf: 'stretch',
        },
      }),
    [edgeX, idleBottom, spacing],
  );

  return (
    <View style={styles.dock} collapsable={false} pointerEvents="box-none">
      <EgDecorButton
        label={t('team.amlGetStarted')}
        mode={mode}
        size="lg"
        figmaType="primary"
        onPress={() => undefined}
        style={styles.actionFullWidth}
      />
      <EgOptionButton
        label={t('team.amlLearnMore')}
        mode={mode}
        size="lg"
        figmaType="tertiary"
        onPress={() => undefined}
        style={styles.actionFullWidth}
      />
    </View>
  );
}