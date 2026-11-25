import { useMemo } from 'react';
import { View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { EgDivider } from '@/eds/team-icons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgDataListRow } from '@/eds/data-list';
import { LIST_ROW_CHEVRON_STROKE_TOKEN } from '@/scenes/shared/listDisclosureChevron';
import { getDataListRowLayout } from '@/scenes/shared/dataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type TeamSubscriptionDisclosureRowProps = {
  label: string;
  value?: string;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  showChevron?: boolean;
  isLast?: boolean;
};

/** 订阅分组卡内 · 左标题右副文案 + chevron（`EgDataListRow` · 圆角壳 `marginH` 归零）。 */
export function TeamSubscriptionDisclosureRow({
  label,
  value,
  onPress,
  testID,
  accessibilityLabel,
  showChevron = true,
  isLast = false,
}: TeamSubscriptionDisclosureRowProps) {
  const { mode, spacing } = useEdsTheme();
  const layout = useMemo(
    () => ({ ...getDataListRowLayout(spacing), marginH: 0 }),
    [spacing],
  );

  return (
    <>
      <EgDataListRow
        mode={mode}
        testID={testID}
        layout={layout}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel ?? label}
      >
        <View
          style={{
            flex: 1,
            minWidth: 0,
            flexDirection: 'row',
            alignItems: 'center',
            gap: edsPx(spacing['spacing-3']),
          }}
        >
          <SceneText variant="bodySemibold" style={{ flex: 1, minWidth: 0 }} numberOfLines={1}>
            {label}
          </SceneText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexShrink: 0,
              gap: edsPx(spacing['spacing-1']),
            }}
          >
            {value != null ? (
              <SceneText variant="bodySmallSecondary" numberOfLines={1}>
                {value}
              </SceneText>
            ) : null}
            {showChevron ? (
              <EgSymbol
                name="eds-arrow-right-mini-ios"
                mode={mode}
                size="sm"
                strokeColorToken={LIST_ROW_CHEVRON_STROKE_TOKEN}
                accessibilityLabel=""
              />
            ) : null}
          </View>
        </View>
      </EgDataListRow>
      {!isLast ? (
        <View style={{ paddingHorizontal: layout.padH }}>
          <EgDivider variant="module" mode={mode} />
        </View>
      ) : null}
    </>
  );
}