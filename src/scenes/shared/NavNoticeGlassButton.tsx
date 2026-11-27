import { StyleSheet, View, type ViewStyle } from 'react-native';
import { EgButtonGlass } from '@/eds/button-glass';
import { EgMessage } from '@/eds/feedback';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

const glassIconDefaults = {
  kind: 'icon' as const,
  iconCount: 1 as const,
  size: 'md' as const,
};

/** 通知胶囊右上 `EgMessage` 偏移（Home / 钱包顶栏共用）。 */
export function navNoticeCapsuleBadgeOffsetStyle(
  spacing: Record<string, string | number>,
): ViewStyle {
  const badgeOffset = edsPx(spacing['spacing-1']);
  return {
    top: -badgeOffset,
    right: -badgeOffset - edsPx(spacing['spacing-1']),
  };
}

type NavNoticeGlassButtonProps = {
  badgeLabel?: string;
  onPress?: () => void;
  glassTestID: string;
  messageTestID: string;
};

/** 通知玻璃钮 + 右上 `EgMessage`（未读合计）。 */
export function NavNoticeGlassButton({
  badgeLabel,
  onPress,
  glassTestID,
  messageTestID,
}: NavNoticeGlassButtonProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();

  return (
    <View style={styles.noticeCapsuleHost}>
      <EgButtonGlass
        {...glassIconDefaults}
        icon="eds-notice"
        mode={mode}
        onPress={onPress}
        accessibilityLabel={t('home.notifications')}
        testID={glassTestID}
      />
      {badgeLabel ? (
        <View
          pointerEvents="none"
          style={[styles.noticeCapsuleBadge, navNoticeCapsuleBadgeOffsetStyle(spacing)]}
        >
          <EgMessage
            mode={mode}
            tone="danger"
            label={badgeLabel}
            accessibilityLabel={t('messages.unreadBadge')}
            testID={messageTestID}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  noticeCapsuleHost: {
    position: 'relative',
    overflow: 'visible',
  },
  noticeCapsuleBadge: {
    position: 'absolute',
    zIndex: 1,
  },
});