import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgAvatar } from '@/eds/button-glass';
import { EgSymbol } from '@/eds/home-ui';
import { EgSystemTag } from '@/eds/home-ui';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  MESSAGE_CATEGORY_BADGE,
  type MessageCategory,
} from '@/scenes/messages/messagesMock';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

const CATEGORIES: {
  id: MessageCategory;
  labelKey: `messages.${string}`;
  icon?: string;
  avatarColorIndex?: number;
}[] = [
  { id: 'team', labelKey: 'messages.categoryTeam', avatarColorIndex: 2 },
  { id: 'transaction', labelKey: 'messages.categoryTransaction', icon: 'eds-scan-code' },
  { id: 'system', labelKey: 'messages.categorySystem', icon: 'eds-notice' },
];

type MessagesCategoryBarProps = {
  active: MessageCategory;
  onChange: (category: MessageCategory) => void;
};

/** 消息顶部分类 · 团队 / 交易 / 系统（Mock 角标）。 */
export function MessagesCategoryBar({ active, onChange }: MessagesCategoryBarProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: edsPx(spacing['spacing-3']),
        },
        item: {
          flex: 1,
          alignItems: 'center',
          gap: edsPx(spacing['spacing-2']),
        },
        iconShell: {
          width: edsPx(spacing['capsule-lg']),
          height: edsPx(spacing['capsule-lg']),
          borderRadius: edsPx(spacing['radius-full']),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: String(colors['material-card-shallow']),
        },
        iconShellActive: {
          backgroundColor: String(colors['event-tap']),
        },
        badgeWrap: {
          position: 'absolute',
          top: -edsPx(spacing['spacing-1']),
          right: -edsPx(spacing['spacing-1']),
        },
        pressed: { opacity: 0.88 },
      }),
    [colors, spacing],
  );

  return (
    <View style={styles.row}>
      {CATEGORIES.map((cat) => {
        const selected = cat.id === active;
        const count = MESSAGE_CATEGORY_BADGE[cat.id];
        return (
          <Pressable
            key={cat.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(cat.id)}
            style={({ pressed }) => [styles.item, pressed ? styles.pressed : null]}
          >
            <View>
              <View style={[styles.iconShell, selected ? styles.iconShellActive : null]}>
                {cat.avatarColorIndex != null ? (
                  <EgAvatar
                    name={t(cat.labelKey)}
                    size="lg"
                    colorIndex={cat.avatarColorIndex}
                    accessibilityLabel=""
                  />
                ) : cat.icon ? (
                  <EgSymbol
                    name={cat.icon}
                    mode={mode}
                    size="md"
                    strokeColorToken={selected ? 'text-base-primary' : 'text-base-secondary'}
                    accessibilityLabel=""
                  />
                ) : null}
              </View>
              <View style={styles.badgeWrap} pointerEvents="none">
                <EgSystemTag label={String(count)} mode={mode} status="danger" size="sm" />
              </View>
            </View>
            <SceneText
              variant="bodySmallSecondary"
              style={selected ? { color: String(colors['text-base-primary']) } : undefined}
            >
              {t(cat.labelKey)}
            </SceneText>
          </Pressable>
        );
      })}
    </View>
  );
}
