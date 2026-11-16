import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { EgDecorButton } from '@/eds/scene-buttons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import type { TransactionRecordsStackParamList } from '@/navigation/types';
import { edsPx } from '@/utils/edsTheme';

type Props = StackScreenProps<TransactionRecordsStackParamList, 'TransactionRecordsMain'>;

type CompareEntry = {
  route: keyof Pick<
    TransactionRecordsStackParamList,
    | 'CompareTeamCenterCardTraditional'
    | 'CompareTeamCenterCardGray'
    | 'CompareHomeTodoCard'
    | 'CompareHomeTodoDivider'
  >;
  labelKey: `compare.${string}`;
};

const COMPARE_ENTRIES: CompareEntry[] = [
  {
    route: 'CompareTeamCenterCardTraditional',
    labelKey: 'compare.teamCenterCardTraditionalEntry',
  },
  {
    route: 'CompareTeamCenterCardGray',
    labelKey: 'compare.teamCenterCardGrayEntry',
  },
  { route: 'CompareHomeTodoCard', labelKey: 'compare.homeTodoCardEntry' },
  { route: 'CompareHomeTodoDivider', labelKey: 'compare.homeTodoDividerEntry' },
];

/** 交易记录 Tab 根屏 · scroll edge 对比入口（独立于正式 Home / TeamCenter）。 */
export function TransactionRecordsScene({ navigation }: Props) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        list: {
          gap: edsPx(spacing['spacing-3']),
          alignSelf: 'stretch',
        },
        entryButton: {
          alignSelf: 'stretch',
        },
      }),
    [spacing],
  );

  const onPressEntry = useCallback(
    (route: CompareEntry['route']) => {
      navigation.navigate(route);
    },
    [navigation],
  );

  return (
    <SceneScaffold
      title={t('scenes.transactionRecordsTitle')}
      subtitle={t('compare.hubSubtitle')}
    >
      <View style={styles.list}>
        {COMPARE_ENTRIES.map((entry) => (
          <EgDecorButton
            key={entry.route}
            mode={mode}
            size="lg"
            label={t(entry.labelKey)}
            onPress={() => onPressEntry(entry.route)}
            accessibilityLabel={t(entry.labelKey)}
            testID={`compare-entry-${entry.route}`}
            style={styles.entryButton}
          />
        ))}
      </View>
    </SceneScaffold>
  );
}