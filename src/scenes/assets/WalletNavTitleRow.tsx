import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { MotionPressable } from '@/eds/team-icons';
import { HOME_COMPANY_NAME_MAX_WIDTH } from '@/scenes/home/HomeNavBarParts';
import {
  TEAM_NAV_CHEVRON_PX,
  TEAM_NAV_DROPDOWN_CHEVRON_STROKE_TOKEN,
} from '@/scenes/team/TeamNavTitleRow';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { useAssetsStore } from '@/store';
import { edsPx } from '@/utils/edsTheme';

type WalletNavTitleRowProps = {
  showChevron?: boolean;
  interactive?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** 钱包 Nav 标题：名称 + 下拉（无头像 · 对齐团队切换文案行）。 */
export function WalletNavTitleRow({
  showChevron = false,
  interactive = false,
  onPress,
  accessibilityLabel,
}: WalletNavTitleRowProps) {
  const { mode, spacing } = useEdsTheme();
  const walletName = useAssetsStore((s) => s.walletName);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        hit: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '100%',
          paddingHorizontal: edsPx(spacing['spacing-2']),
          paddingVertical: edsPx(spacing['spacing-1']),
        },
        nameChevron: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-1']),
          flexShrink: 1,
          minWidth: 0,
        },
        nameWrap: {
          maxWidth: HOME_COMPANY_NAME_MAX_WIDTH,
          flexShrink: 1,
          minWidth: 0,
        },
        chevronSlot: {
          width: TEAM_NAV_CHEVRON_PX,
          height: TEAM_NAV_CHEVRON_PX,
          alignItems: 'center',
          justifyContent: 'center',
        },
        pressed: { opacity: 0.88 },
      }),
    [spacing],
  );

  const inner = (
    <View style={styles.nameChevron}>
      <View style={styles.nameWrap}>
        <SceneText variant="bodySemibold" numberOfLines={1} ellipsizeMode="tail">
          {walletName}
        </SceneText>
      </View>
      {showChevron ? (
        <View style={styles.chevronSlot}>
          <EgSymbol
            name="eds-arrow-down-ios"
            mode={mode}
            displayPx={TEAM_NAV_CHEVRON_PX}
            strokeColorToken={TEAM_NAV_DROPDOWN_CHEVRON_STROKE_TOKEN}
            accessibilityLabel=""
          />
        </View>
      ) : null}
    </View>
  );

  if (interactive && onPress != null) {
    return (
      <MotionPressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }: { pressed: boolean }) => [styles.hit, pressed ? styles.pressed : null]}
      >
        {inner}
      </MotionPressable>
    );
  }

  return <View style={styles.hit}>{inner}</View>;
}