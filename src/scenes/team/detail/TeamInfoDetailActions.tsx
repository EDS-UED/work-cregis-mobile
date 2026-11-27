import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EgDangerButton } from '@/eds/scene-buttons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { teamInfoActionsEdgeInset } from '@/scenes/team/detail/teamInfoActionsLayout';
import { edsPx } from '@/utils/edsTheme';

/** 团队信息屏底常驻 ·「解散团队」全宽。 */
export function TeamInfoDetailActions() {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const edgeX = teamInfoActionsEdgeInset(spacing);
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
        },
        actionFullWidth: {
          alignSelf: 'stretch',
        },
      }),
    [edgeX, idleBottom],
  );

  return (
    <View style={styles.dock} collapsable={false} pointerEvents="box-none">
      <EgDangerButton
        label={t('team.disbandTeam')}
        mode={mode}
        size="lg"
        figmaType="tertiary"
        onPress={() => undefined}
        style={styles.actionFullWidth}
      />
    </View>
  );
}