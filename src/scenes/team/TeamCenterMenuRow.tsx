import { View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { DataListRow } from '@/scenes/shared/DataListRow';
import { TeamCenterMenuLeadIcon } from '@/scenes/team/TeamCenterMenuLeadIcon';
import {
  getTeamCenterDataListRowLayout,
  teamCenterDataListMediaGap,
} from '@/scenes/team/teamCenterDataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type TeamCenterMenuRowProps = {
  label: string;
  subtitle: string;
  onPress?: () => void;
  testID?: string;
};

export function TeamCenterMenuRow({
  label,
  subtitle,
  onPress,
  testID,
}: TeamCenterMenuRowProps) {
  const { mode, spacing } = useEdsTheme();
  const layout = getTeamCenterDataListRowLayout(spacing);
  const mediaGap = teamCenterDataListMediaGap(spacing);

  return (
    <DataListRow
      testID={testID}
      accessibilityLabel={label}
      onPress={onPress}
      layout={layout}
      gap={mediaGap}
    >
      <TeamCenterMenuLeadIcon />
      <View
        style={{
          flex: 1,
          minWidth: 0,
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-8']),
        }}
      >
        <View
          style={{
            flex: 1,
            minWidth: 0,
            gap: edsPx(spacing['spacing-05']),
          }}
        >
          <SceneText variant="bodyMediumStrong">{label}</SceneText>
          <SceneText variant="bodySmallSecondary">{subtitle}</SceneText>
        </View>
        <EgSymbol
          name="eds-arrow-right-mini-ios"
          mode={mode}
          size="sm"
          strokeColorToken="text-base-secondary"
          accessibilityLabel=""
        />
      </View>
    </DataListRow>
  );
}
