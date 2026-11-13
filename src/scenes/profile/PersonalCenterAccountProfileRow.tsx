import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { EgAvatar } from '@/eds/button-glass';
import { EgDivider } from '@/eds/profile-icons';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  useHomeUserAvatarColorIndex,
  useHomeUserDisplayName,
} from '@/scenes/shared/homeUserIdentity';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

const DEMO_MASKED_EMAIL = 't******o@gmail.com';

type PersonalCenterAccountProfileRowProps = {
  isLast?: boolean;
};

/** 账户组 · 头像 + 昵称 / 邮箱展示行（非点击）。 */
export function PersonalCenterAccountProfileRow({
  isLast = false,
}: PersonalCenterAccountProfileRowProps) {
  const { mode, spacing } = useEdsTheme();
  const displayName = useHomeUserDisplayName();
  const userAvatarColorIndex = useHomeUserAvatarColorIndex();

  const rowPaddingH = edsPx(spacing['spacing-4']);
  const rowPaddingV = edsPx(spacing['spacing-4']);
  const mediaGap = edsPx(spacing['spacing-4']);
  const titleSubGap = edsPx(spacing['spacing-05']);
  const dividerMarginTop = edsPx(spacing['spacing-1']);
  const dividerMarginBottom = edsPx(spacing['spacing-1']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: rowPaddingH,
          paddingVertical: rowPaddingV,
        },
        avatarSlot: {
          marginRight: mediaGap,
        },
        textCol: {
          flex: 1,
          minWidth: 0,
          gap: titleSubGap,
        },
        dividerWrap: {
          paddingHorizontal: rowPaddingH,
          marginTop: dividerMarginTop,
          marginBottom: dividerMarginBottom,
        },
      }),
    [dividerMarginBottom, dividerMarginTop, mediaGap, rowPaddingH, rowPaddingV, titleSubGap],
  );

  return (
    <>
      <View style={styles.row} testID="profile-row-account-profile">
        <View style={styles.avatarSlot}>
          <EgAvatar
            name={displayName}
            size="5xl"
            colorIndex={userAvatarColorIndex}
            accessibilityLabel={displayName}
          />
        </View>
        <View style={styles.textCol}>
          <SceneText variant="title" numberOfLines={1}>
            {displayName}
          </SceneText>
          <SceneText variant="bodySmallSecondary" numberOfLines={1}>
            {DEMO_MASKED_EMAIL}
          </SceneText>
        </View>
      </View>
      {!isLast ? (
        <View style={styles.dividerWrap}>
          <EgDivider variant="module" mode={mode} />
        </View>
      ) : null}
    </>
  );
}
