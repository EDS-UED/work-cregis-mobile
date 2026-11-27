import type { ImageSourcePropType } from 'react-native';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  EgDataListPrimaryText,
  EgDataListReddot,
  EgDataListRow,
  EgDataListSubText,
} from '@/eds/data-list';
import { EgSymbol } from '@/eds/profile-icons';
import { getDataListRowLayout } from '@/scenes/shared/dataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type MessagesListRowProps = {
  title: string;
  subtitle: string;
  timeLabel: string;
  unread?: boolean;
  /** 模板 Landing Page 可进入时展示箭头。 */
  showArrow?: boolean;
  avatarLetter?: string;
  avatarName?: string;
  avatarSource?: ImageSourcePropType;
  avatarColorIndex?: number;
  leadSymbol?: string;
  leadSystemPlaceholder?: boolean;
  leadDangerRefuse?: boolean;
  onPress?: () => void;
};

/** 消息列表行 · 主副文案 + 时间。行首图标不展示。 */
export function MessagesListRow({
  title,
  subtitle,
  timeLabel,
  unread,
  showArrow = false,
  onPress,
}: MessagesListRowProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const layout = getDataListRowLayout(spacing);
  const mediaGap = edsPx(spacing['spacing-3']);
  const titleGap = edsPx(spacing['spacing-2']);
  const subtitleIndent = unread ? edsPx(spacing.reddot) + titleGap : 0;

  return (
    <EgDataListRow
      mode={mode}
      accessibilityLabel={title}
      onPress={onPress}
      layout={layout}
      gap={mediaGap}
    >
      <View style={{ flex: 1, minWidth: 0, gap: edsPx(spacing['spacing-1']) }}>
        {timeLabel ? (
          <SceneText variant="bodySmallTertiary" style={{ alignSelf: 'flex-start' }}>
            {timeLabel}
          </SceneText>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: edsPx(spacing['spacing-3']),
          }}
        >
          <View style={{ flex: 1, minWidth: 0, gap: edsPx(spacing['spacing-05']) }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: titleGap,
                alignSelf: 'stretch',
              }}
            >
              {unread ? (
                <EgDataListReddot mode={mode} accessibilityLabel={t('messages.unreadBadge')} />
              ) : null}
              <EgDataListPrimaryText
                mode={mode}
                weight="heavy"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ flex: 1, minWidth: 0 }}
              >
                {title}
              </EgDataListPrimaryText>
            </View>
            {subtitle ? (
              <EgDataListSubText
                mode={mode}
                segmentA={subtitle}
                ellipsizeMode="tail"
                style={{ alignSelf: 'stretch', marginLeft: subtitleIndent }}
              />
            ) : null}
          </View>
          {showArrow ? (
            <EgSymbol
              name="eds-arrow-right-ios"
              mode={mode}
              size="sm"
              strokeColorToken="text-base-tertiary"
              accessibilityLabel=""
            />
          ) : null}
        </View>
      </View>
    </EgDataListRow>
  );
}
