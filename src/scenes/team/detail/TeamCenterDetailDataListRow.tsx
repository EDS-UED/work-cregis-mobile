import type { ReactNode } from 'react';
import { View } from 'react-native';

import {
  EG_DATA_LIST_SUB_TEXT_MAX_LINES,
  EgDataListPrimaryRow,
  EgDataListRow,
  EgDataListSubText,
  type EgDataListSubTextSegmentSymbol,
} from '@/eds/data-list';
import { EgSymbol } from '@/eds/home-ui';
import { EgSwitch } from '@/eds/toggle';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { LIST_ROW_CHEVRON_STROKE_TOKEN } from '@/scenes/shared/listDisclosureChevron';
import {
  getTeamCenterDataListRowLayout,
  teamCenterDataListMediaGap,
} from '@/scenes/team/teamCenterDataListLayout';

type TeamCenterDetailDataListRowProps = {
  testID?: string;
  accessibilityLabel: string;
  primary: string;
  tag?: ReactNode;
  subSegmentA?: string;
  subSegmentB?: string;
  boldSubA?: boolean;
  /** 副文本片段 A 前 · 符号 `xs` · 默认关。 */
  subSegmentSymbol?: EgDataListSubTextSegmentSymbol;
  lead?: ReactNode;
  onPress?: () => void;
  trailing?: 'chevron' | 'switch' | null;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
};

/** 团队中心子页 · Showcase 同源 DL 行（`EgDataListPrimaryRow` + 副文本 + 行尾）。 */
export function TeamCenterDetailDataListRow({
  testID,
  accessibilityLabel,
  primary,
  tag,
  subSegmentA,
  subSegmentB,
  boldSubA,
  subSegmentSymbol,
  lead,
  onPress,
  trailing = 'chevron',
  switchValue = false,
  onSwitchChange,
}: TeamCenterDetailDataListRowProps) {
  const { mode, spacing } = useEdsTheme();
  const layout = getTeamCenterDataListRowLayout(spacing);
  const mediaGap = teamCenterDataListMediaGap(spacing);
  const hasLead = lead != null;
  const showSub = subSegmentA != null || subSegmentB != null;
  const switchIsolated =
    trailing === 'switch' && onSwitchChange != null && onPress != null;
  const switchRow = trailing === 'switch' && onSwitchChange != null && !switchIsolated;
  const handleRowPress = switchIsolated
    ? onPress
    : switchRow
      ? () => onSwitchChange(!switchValue)
      : onPress;
  const rowInteractive = handleRowPress != null;

  return (
    <EgDataListRow
      testID={testID}
      mode={mode}
      axis={hasLead ? 'row' : 'column'}
      gap={hasLead ? mediaGap : undefined}
      layout={layout}
      accessibilityLabel={accessibilityLabel}
      onPress={rowInteractive ? handleRowPress : undefined}
      interactive={rowInteractive}
    >
      {lead}
      <View
        style={{
          flex: 1,
          minWidth: 0,
          flexDirection: 'row',
          alignItems: 'stretch',
        }}
      >
        <View style={{ flex: 1, minWidth: 0, gap: layout.titleSubGap }}>
          <EgDataListPrimaryRow mode={mode} weight="heavy" tag={tag}>
            {primary}
          </EgDataListPrimaryRow>
          {showSub ? (
            <EgDataListSubText
              mode={mode}
              segmentA={subSegmentA ?? ''}
              segmentB={subSegmentB ?? ''}
              boldSegmentA={boldSubA === true}
              segmentSymbol={subSegmentSymbol}
              numberOfLines={EG_DATA_LIST_SUB_TEXT_MAX_LINES}
              ellipsizeMode="tail"
            />
          ) : null}
        </View>
        {trailing === 'chevron' ? (
          <View
            style={{
              flexShrink: 0,
              alignSelf: 'stretch',
              justifyContent: 'center',
              marginLeft: layout.contentSlotGap,
            }}
          >
            <EgSymbol
              name="eds-arrow-right-mini-ios"
              mode={mode}
              size="sm"
              strokeColorToken={LIST_ROW_CHEVRON_STROKE_TOKEN}
              accessibilityLabel=""
            />
          </View>
        ) : null}
        {trailing === 'switch' ? (
          <View
            style={{
              flexShrink: 0,
              alignSelf: 'stretch',
              justifyContent: 'center',
              marginLeft: layout.contentSlotGap,
            }}
          >
            <EgSwitch
              mode={mode}
              value={switchValue}
              onValueChange={onSwitchChange}
              accessibilityLabel={accessibilityLabel}
            />
          </View>
        ) : null}
      </View>
    </EgDataListRow>
  );
}