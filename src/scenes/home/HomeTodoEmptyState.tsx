import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

/** 待办列表无数据 — business 图标 + 四级文案（距筛选胶囊 120px）。 */
export function HomeTodoEmptyState() {
  const { t } = useTranslation();
  const { colors, mode, spacing } = useEdsTheme();
  const iconPx = edsPx(spacing['avatar-xl']);
  const gap = edsPx(spacing['spacing-3']);
  const offsetFromCapsules =
    edsPx(spacing['spacing-20']) + edsPx(spacing['spacing-10']);

  return (
    <View
      style={[
        styles.root,
        {
          marginTop: offsetFromCapsules,
          gap,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={t('home.todoEmpty')}
    >
      <EgSymbol
        name="eds-business-7"
        mode={mode}
        displayPx={iconPx}
        strokeColorToken="material-base-quaternary"
      />
      <SceneText
        variant="bodyMedium"
        style={{ color: colors['text-base-quaternary'] }}
      >
        {t('home.todoEmpty')}
      </SceneText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
});
