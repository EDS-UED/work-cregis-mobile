import { Text, View } from 'react-native';

import { EgAvatar } from '@/eds/button-glass';
import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgDataListRow } from '@/eds/data-list';
import { getDataListRowLayout } from '@/scenes/shared/dataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import type { CollaborationItem, CollaborationSignKind } from '@/store/useCollaborationStore';
import { useEdsTypography } from '@/hooks/useEdsTypography';
import { edsPx } from '@/utils/edsTheme';
import { formatMobileDateTime } from '@/utils/formatMobileDateTime';

type CollaborationTodoRowProps = {
  item: CollaborationItem;
  signKindLabel: string;
  actionLine: string;
  onPress?: () => void;
};

function signKindBorderColor(
  kind: CollaborationSignKind,
  colors: ReturnType<typeof useEdsTheme>['colors'],
) {
  if (kind === 'approval') return String(colors.brand);
  return String(colors['text-base-primary']);
}

export function CollaborationTodoRow({
  item,
  signKindLabel,
  actionLine,
  onPress,
}: CollaborationTodoRowProps) {
  const { mode, spacing, colors } = useEdsTheme();
  const text = useEdsTypography();
  const secondaryColor = String(colors['text-base-secondary']);
  const layout = getDataListRowLayout(spacing);
  const mediaGap = edsPx(spacing['spacing-3']);
  const avatarSize = edsPx(spacing['avatar-xl']);
  const badgeSize = edsPx(spacing['spacing-4']);

  return (
    <EgDataListRow
      mode={mode}
      accessibilityLabel={`${item.amount} ${item.currency}`}
      onPress={onPress}
      layout={layout}
      gap={mediaGap}
    >
      <View style={{ width: avatarSize, height: avatarSize, position: 'relative' }}>
        <EgAvatar
          name={item.avatarLetter}
          size="xl"
          colorIndex={item.avatarColorIndex}
          accessibilityLabel={item.initiatorName}
        />
        {item.chainSymbol ? (
          <View
            style={{
              position: 'absolute',
              right: -edsPx(spacing['spacing-05']),
              bottom: -edsPx(spacing['spacing-05']),
              width: badgeSize,
              height: badgeSize,
              borderRadius: edsPx(spacing['radius-full']),
              backgroundColor: String(colors['material-card-deep']),
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: String(colors['material-card-shallow']),
            }}
          >
            <EgSymbol name={item.chainSymbol} mode={mode} displayPx={badgeSize * 0.72} accessibilityLabel="" />
          </View>
        ) : null}
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: layout.titleSubGap }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: edsPx(spacing['spacing-2']),
          }}
        >
          <SceneText variant="bodySemibold">{item.amount}</SceneText>
          <SceneText variant="bodySemibold">{item.currency}</SceneText>
        </View>
        <Text style={[text.bodySmallSecondary, { color: secondaryColor }]} numberOfLines={2}>
          <Text style={[text.bodyMediumStrong, { color: secondaryColor }]}>
            {item.initiatorName}{' '}
          </Text>
          {actionLine}
        </Text>
        <SceneText variant="bodySmallSecondary">
          {formatMobileDateTime(item.timestamp)}
        </SceneText>
      </View>
      <View
        style={{
          paddingHorizontal: edsPx(spacing['spacing-3']),
          paddingVertical: edsPx(spacing['spacing-1']),
          borderRadius: edsPx(spacing['radius-full']),
          borderWidth: 1,
          borderColor: signKindBorderColor(item.signKind, colors),
        }}
      >
        <SceneText variant="footnotePrimary">{signKindLabel}</SceneText>
      </View>
    </EgDataListRow>
  );
}
